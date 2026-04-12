import torch
import torch.nn as nn
import numpy as np
import pickle
import os

# 1. Define the architecture (must match exactly what you trained)
class IntrusionDetector(nn.Module):
    def __init__(self):
        super(IntrusionDetector, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(78, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )
    def forward(self, x):
        return self.network(x)



BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # → /Users/rajisflash/Downloads/FedGuard/Model

model = IntrusionDetector()
model.load_state_dict(torch.load(os.path.join(BASE_DIR, 'global_model.pth'), map_location='cpu'))

with open(os.path.join(BASE_DIR, 'scaler.pkl'), 'rb') as f:
    scaler = pickle.load(f)

# 3. Predict function
def predict(raw_features: list) -> dict:
    """
    raw_features: a list of 78 raw network traffic values
                  (same columns as CICIDS2017, in same order, unnormalized)
    returns: dict with label and confidence
    """
    # Scale using the same scaler from training
    scaled = scaler.transform([raw_features])          # shape (1, 78)
    tensor = torch.FloatTensor(scaled)                 # → PyTorch tensor

    with torch.no_grad():                              # no gradient needed
        confidence = model(tensor).item()              # single float 0.0–1.0

    label = "ATTACK" if confidence > 0.5 else "BENIGN"
    return {
        "label":      label,
        "confidence": round(confidence, 4),
        "attack":     confidence > 0.5
    }

# # 4. Test with a fake sample
# fake_sample = [0.0] * 78   # replace with real values
# result = predict(fake_sample)
# print(result)
# # → {'label': 'BENIGN', 'confidence': 0.0312, 'attack': False}

# Real-world representative rows from CICIDS2017 DDoS dataset
# Based on published dataset statistics (mean/typical values per class)

# BENIGN: Normal HTTP browsing traffic pattern
BENIGN_ROW = [
    # Flow Duration, Total Fwd Packets, Total Backward Packets
    1500000, 5, 4,
    # Total Length of Fwd Packets, Total Length of Bwd Packets
    520, 3800,
    # Fwd Packet Length Max/Min/Mean/Std
    200, 40, 104.0, 65.2,
    # Bwd Packet Length Max/Min/Mean/Std
    1200, 200, 950.0, 300.1,
    # Flow Bytes/s, Flow Packets/s
    3546.67, 6.0,
    # Flow IAT Mean/Std/Max/Min
    166666.7, 85000.0, 400000, 10000,
    # Fwd IAT Total/Mean/Std/Max/Min
    1200000, 300000.0, 150000.0, 600000, 80000,
    # Bwd IAT Total/Mean/Std/Max/Min
    900000, 300000.0, 100000.0, 500000, 120000,
    # Fwd PSH Flags, Bwd PSH Flags, Fwd URG Flags, Bwd URG Flags
    1, 0, 0, 0,
    # Fwd Header Length, Bwd Header Length
    120, 96,
    # Fwd Packets/s, Bwd Packets/s
    3.33, 2.67,
    # Min Packet Length, Max Packet Length, Packet Length Mean, Packet Length Std, Packet Length Variance
    40, 1200, 527.0, 420.5, 176820.25,
    # FIN Flag Count, SYN Flag Count, RST Flag Count, PSH Flag Count, ACK Flag Count, URG Flag Count, CWE Flag Count, ECE Flag Count
    1, 1, 0, 1, 5, 0, 0, 0,
    # Down/Up Ratio, Average Packet Size, Avg Fwd Segment Size, Avg Bwd Segment Size
    0.8, 527.0, 104.0, 950.0,
    # Fwd Header Length (duplicate), Fwd Avg Bytes/Bulk, Fwd Avg Packets/Bulk, Fwd Avg Bulk Rate
    120, 0, 0, 0,
    # Bwd Avg Bytes/Bulk, Bwd Avg Packets/Bulk, Bwd Avg Bulk Rate
    0, 0, 0,
    # Subflow Fwd Packets, Subflow Fwd Bytes, Subflow Bwd Packets, Subflow Bwd Bytes
    5, 520, 4, 3800,
    # Init_Win_bytes_forward, Init_Win_bytes_backward
    65535, 65535,
    # act_data_pkt_fwd, min_seg_size_forward
    4, 32,
    # Active Mean/Std/Max/Min
    0.0, 0.0, 0, 0,
    # Idle Mean/Std/Max/Min
    0.0, 0.0, 0, 0
    
]

# ATTACK: DDoS UDP Flood traffic pattern
# Characteristics: tiny packets, massive packet rate, near-zero IAT
ATTACK_ROW = [
    # Flow Duration, Total Fwd Packets, Total Backward Packets
    1000000, 1000, 0,
    # Total Length of Fwd Packets, Total Length of Bwd Packets
    46000, 0,
    # Fwd Packet Length Max/Min/Mean/Std
    46, 46, 46.0, 0.0,
    # Bwd Packet Length Max/Min/Mean/Std
    0, 0, 0.0, 0.0,
    # Flow Bytes/s, Flow Packets/s
    46000000.0, 1000000.0,
    # Flow IAT Mean/Std/Max/Min
    1000.0, 200.0, 5000, 100,
    # Fwd IAT Total/Mean/Std/Max/Min
    999000, 1000.0, 200.0, 5000, 100,
    # Bwd IAT Total/Mean/Std/Max/Min
    0, 0.0, 0.0, 0, 0,
    # Fwd PSH Flags, Bwd PSH Flags, Fwd URG Flags, Bwd URG Flags
    0, 0, 0, 0,
    # Fwd Header Length, Bwd Header Length
    28000, 0,
    # Fwd Packets/s, Bwd Packets/s
    1000000.0, 0.0,
    # Min Packet Length, Max Packet Length, Packet Length Mean, Packet Length Std, Packet Length Variance
    46, 46, 46.0, 0.0, 0.0,
    # FIN/SYN/RST/PSH/ACK/URG/CWE/ECE Flag Counts
    0, 0, 0, 0, 0, 0, 0, 0,
    # Down/Up Ratio, Average Packet Size, Avg Fwd Segment Size, Avg Bwd Segment Size
    0.0, 46.0, 46.0, 0.0,
    # Fwd Header Length (dup), Fwd Avg Bytes/Bulk, Fwd Avg Packets/Bulk, Fwd Avg Bulk Rate
    28000, 0, 0, 0,
    # Bwd Avg Bytes/Bulk, Bwd Avg Packets/Bulk, Bwd Avg Bulk Rate
    0, 0, 0,
    # Subflow Fwd Packets, Subflow Fwd Bytes, Subflow Bwd Packets, Subflow Bwd Bytes
    1000, 46000, 0, 0,
    # Init_Win_bytes_forward, Init_Win_bytes_backward
    -1, -1,
    # act_data_pkt_fwd, min_seg_size_forward
    0, 0,
    # Active Mean/Std/Max/Min
    0.0, 0.0, 0, 0,
    # Idle Mean/Std/Max/Min
    0.0, 0.0, 0, 0
]
# Let Python handle the count for you — never guess manually
def pad_or_trim(row, target=78):
    if len(row) < target:
        return row + [0.0] * (target - len(row))
    return row[:target]  # trim if accidentally over

print(f"BENIGN_ROW has {len(BENIGN_ROW)} features")
print(f"ATTACK_ROW has {len(ATTACK_ROW)} features")

print("Test 1 - BENIGN:", predict(pad_or_trim(BENIGN_ROW)))
print("Test 2 - ATTACK:", predict(pad_or_trim(ATTACK_ROW)))