import requests
import numpy as np
import json
import time
import random
import sys
import os
SERVER = os.environ.get("SERVER", "http://localhost:8080/api")
CLIENT_ID = sys.argv[1] if len(sys.argv) > 1 else "client-1"
LOCAL_EPOCHS = 3
WEIGHT_SIZE = 128

# DP parameters
EPSILON = 1.0       # privacy budget — lower = more private
DELTA = 1e-5        # failure probability
CLIP_NORM = 1.0     # L2 sensitivity

def get_global_model():
    r = requests.get(f"{SERVER}/fl/global-model")
    data = r.json()
    weights = json.loads(data["weights"]) if isinstance(data["weights"], str) else data["weights"]
    return np.array(weights) if weights else np.random.rand(WEIGHT_SIZE)


def get_token():
    r = requests.post(f"{SERVER}/auth/token", json={
        "clientId": CLIENT_ID,
        "secret": "fedguard2026"
    })
    token = r.json().get("token")
    print(f"[{CLIENT_ID}] JWT obtained: {token[:20]}...")
    return token

def submit_update(weights, accuracy, loss, token):
    payload = {
        "clientId": CLIENT_ID,
        "weights": json.dumps(weights.tolist()),
        "accuracy": accuracy,
        "loss": loss
    }
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.post(f"{SERVER}/fl/submit", json=payload, headers=headers)
    return r.json()

def train_locally(global_weights):
    weights = global_weights.copy()
    for epoch in range(LOCAL_EPOCHS):
        noise = np.random.normal(0, 0.01, size=weights.shape)
        weights = weights - 0.05 * noise
    accuracy = round(random.uniform(0.82, 0.97), 4)
    loss     = round(random.uniform(0.05, 0.25), 4)
    return weights, accuracy, loss

def clip_weights(weights, clip_norm=CLIP_NORM):
    """L2 norm clipping — bounds sensitivity"""
    l2 = np.linalg.norm(weights)
    if l2 > clip_norm:
        weights = weights * (clip_norm / l2)
    return weights

def add_dp_noise(weights, epsilon=EPSILON, delta=DELTA, clip_norm=CLIP_NORM):
    """Gaussian mechanism — calibrated to (epsilon, delta)-DP"""
    sigma = np.sqrt(2 * np.log(1.25 / delta)) * clip_norm / epsilon
    noise = np.random.normal(0, sigma, size=weights.shape)
    print(f"[{CLIENT_ID}] DP noise σ={sigma:.4f} (ε={epsilon}, δ={delta})")
    return weights + noise

def submit_update(weights, accuracy, loss, token):
    payload = {
        "clientId": CLIENT_ID,
        "weights": json.dumps(weights.tolist()),
        "accuracy": accuracy,
        "loss": loss
    }
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.post(f"{SERVER}/fl/submit", json=payload, headers=headers)
    return r.json()

def run_fl_client(rounds=5):
    print(f"[{CLIENT_ID}] Authenticating...")
    token = get_token()  # get once, reuse for all rounds

    print(f"[{CLIENT_ID}] Starting FL client for {rounds} rounds...")
    for i in range(rounds):
        print(f"\n[{CLIENT_ID}] Round {i+1} — fetching global model...")
        global_weights = get_global_model()

        weights, accuracy, loss = train_locally(global_weights)
        weights = clip_weights(weights)
        weights = add_dp_noise(weights)

        print(f"[{CLIENT_ID}] Submitting — acc: {accuracy}, loss: {loss}")
        result = submit_update(weights, accuracy, loss, token)
        print(f"[{CLIENT_ID}] Server response: {result}")

        time.sleep(3)

if __name__ == "__main__":
    run_fl_client(rounds=5)