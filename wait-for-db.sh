#!/bin/sh
# wait-for-db.sh - wait for a TCP port to be available using Python (no external tools required)
set -e
host=${1:-db}
port=${2:-5432}
count=0
# Try connecting using Python socket; print progress
python - "$host" "$port" <<PY
import socket, time, sys
host = sys.argv[1]
port = int(sys.argv[2])
count = 0
while True:
    count += 1
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1.0)
    try:
        s.connect((host, port))
    except Exception:
        print(f"Waiting for {host}:{port}... ({count})")
        time.sleep(1)
        continue
    finally:
        try:
            s.close()
        except Exception:
            pass
    print(f"{host}:{port} is available")
    sys.exit(0)
PY