# FedGuard 🛡️

> **A privacy-preserving Federated Learning platform secured with ECDSA signatures, Differential Privacy, SHA-256 audit logs, and anomaly detection.**

---

## Overview

FedGuard is a full-stack federated learning system that enables distributed clients to collaboratively train a shared ML model without ever sharing raw data. Each round of training is cryptographically signed, audited, and noise-protected — making FedGuard suitable for sensitive domains like healthcare, finance, and edge computing.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Admin Dashboard                │
│                 (React + Vite)                  │
└────────────────────┬────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────┐
│              Spring Boot Backend                │
│     (Auth · Round Management · PostgreSQL)      │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│           Flower FL Server (Python)             │
│    (FedAvg · ECDSA Verify · SHA-256 Audit)      │
└─────┬──────────────┬──────────────┬─────────────┘
      │              │              │
┌─────▼──┐     ┌─────▼──┐    ┌─────▼──┐
│Client 0│     │Client 1│    │Client N│  (Docker)
│PyTorch │     │PyTorch │    │PyTorch │
│DP Noise│     │DP Noise│    │DP Noise│
│ECDSA   │     │ECDSA   │    │ECDSA   │
└────────┘     └────────┘    └────────┘
```

---

## Security Pipeline

Each federated round runs the following pipeline:

```
Client weights
     │
     ▼
SHA-256 digest of weights
     │
     ▼
ECDSA sign with client private key
     │
     ▼
Server receives (weights + signature)
     │
     ▼
ECDSA verify with client public key ──► ✅ Verified / ❌ Anomaly
     │
     ▼
Differential Privacy noise injection
     │
     ▼
FedAvg aggregation
     │
     ▼
SHA-256 audit hash of full round state ──► Immutable log entry
```

---

## Features

- 🔐 **ECDSA Signatures** — every client weight update is cryptographically signed and verified per round, preventing model poisoning attacks
- 🔒 **SHA-256 Audit Log** — each round produces a tamper-evident hash of all weights and signatures, creating an immutable training history
- 🌫️ **Differential Privacy** — calibrated Gaussian noise added to gradients before upload, providing formal (ε, δ)-DP guarantees
- 🕵️ **Anomaly Detection** — server flags clients whose updates deviate statistically from the round average
- 🌐 **Full-Stack Management** — Spring Boot REST API with JWT auth, React admin dashboard, and PostgreSQL persistence
- 🐳 **Dockerized** — all services containerized for reproducible local and cloud deployment

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| FL Orchestration | Flower (flwr) | Client-server federated training loop |
| Local Training | PyTorch | Model definition, forward/backward pass |
| Cryptography | Python `cryptography` + OpenSSL | ECDSA key gen, signing, verification |
| Hashing | SHA-256 (hashlib) | Weight fingerprinting + round audit log |
| Privacy | Gaussian DP noise | Differential privacy guarantees |
| Backend API | Java Spring Boot | REST endpoints, auth, round management |
| Frontend | React + Vite | Admin dashboard, client portal |
| Database | PostgreSQL | Round history, client records, metrics |
| Containerization | Docker + Docker Compose | Service isolation and orchestration |

---

## Sample Output

```
Starting FedGuard — Full Pipeline (ECDSA + DP + SHA-256 + Audit Log)
DP: True | Noise: 0.01 | Clients: 5 | Rounds: 10

--- Round 1 ---
  [Client 0] ✅ Verified | Loss: 0.0521
  [Client 1] ✅ Verified | Loss: 0.0522
  [Client 2] ✅ Verified | Loss: 0.0541
  [Client 3] ✅ Verified | Loss: 0.0528
  [Client 4] ✅ Verified | Loss: 0.0522

>>> Round 1 | Hash: f07317d8638ed004... | Accuracy: 0.9788 | Anomalies: 0

...

>>> Round 10 | Hash: 0e9dd80111d663b1... | Accuracy: 0.9915 | Anomalies: 0

Simulation complete.
```

---

## Project Structure

```
FedGuard/
├── backend/                  # Spring Boot REST API (Java)
│   └── src/main/java/
│       └── com/fedguard/
│           ├── controller/   # REST endpoints
│           ├── service/      # Business logic
│           ├── model/        # JPA entities
│           └── security/     # JWT auth config
│
├── fl-clients/               # Flower FL clients (Python)
│   ├── client.py             # PyTorch model + ECDSA signing
│   ├── server.py             # Flower server + FedAvg + audit log
│   ├── crypto_utils.py       # ECC key gen, SHA-256, ECDSA helpers
│   └── dp_utils.py           # Differential privacy noise injection
│
├── admin-dashboard/          # React + Vite admin UI
│   └── src/
│       ├── components/
│       └── pages/
│
├── client-portal/            # React client-facing portal
│
├── notebooks/                # Cryptography research notebooks
│   └── ecc_crypto.ipynb      # ECC, AES, DES, IDEA from scratch
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Docker Desktop
- Java 21+
- Python 3.10+
- Node.js 18+

### Run with Docker

```bash
# Clone the repo
git clone https://github.com/<your-username>/FedGuard.git
cd FedGuard

# Start all services
docker compose up --build
```

### Run FL Pipeline Manually

```bash
# Install Python dependencies
cd fl-clients
pip install flwr torch cryptography

# Start the Flower server
python server.py

# In separate terminals, start each client
python client.py --client-id 0
python client.py --client-id 1
```

### Run Spring Boot Backend

```bash
cd backend
./gradlew bootRun
```

---

## Configuration

| Parameter | Default | Description |
|---|---|---|
| `NUM_CLIENTS` | 5 | Number of FL clients per round |
| `NUM_ROUNDS` | 10 | Total federated training rounds |
| `DP_ENABLED` | True | Enable differential privacy |
| `DP_NOISE` | 0.01 | Gaussian noise scale (σ) |
| `CURVE` | secp256k1 | ECC curve for ECDSA |

---

## How Security Works

### ECDSA (Authentication)
Each client holds an ECC private key. Before uploading weights, the client hashes them with SHA-256 and signs the digest. The server verifies the signature using the registered public key — ensuring updates are authentic and unmodified.

### SHA-256 (Integrity)
After each round, the server computes a SHA-256 hash over the aggregated weights, all client signatures, and the round number. This hash is stored as an audit log entry — any post-hoc tampering with round data is immediately detectable.

### Differential Privacy
Gaussian noise scaled to `σ = 0.01` is injected into each client's gradients before transmission. This provides formal (ε, δ)-DP guarantees, preventing the server from inferring individual training samples from weight updates.

---

## Cryptography Notebook

The `notebooks/ecc_crypto.ipynb` implements cryptographic primitives from scratch:

- **DES** — Feistel network, 16-round key schedule, S-boxes
- **IDEA** — Mixed algebraic group operations (XOR, mod 2¹⁶, mod 2¹⁶+1)
- **AES-128** — SubBytes, ShiftRows, MixColumns, AddRoundKey
- **ECC** — Point addition, scalar multiplication, ECDH key exchange, ECDSA sign/verify
- **OpenSSL integration** — Real key generation and signature verification with `secp256k1` and `prime256v1`

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

Built by a Computer Science student at VIT Vellore as a research project in privacy-preserving machine learning and applied cryptography.
