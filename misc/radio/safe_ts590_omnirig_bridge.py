import argparse
import logging
import os
import socket
import sys
import time

import serial


READ_COMMANDS = {
    "AI;",
    "FA;",
    "FB;",
    "FR;",
    "FT;",
    "ID;",
    "IF;",
    "MD;",
}


def rigctld_raw(endpoint, command, expect_reply):
    host, port_text = endpoint.rsplit(":", 1)
    payload = f"w {command}\n".encode("ascii")

    with socket.create_connection((host, int(port_text)), timeout=2.0) as sock:
        sock.sendall(payload)
        if not expect_reply:
            return b""

        sock.settimeout(0.8)
        chunks = []
        deadline = time.monotonic() + 1.5
        while time.monotonic() < deadline:
            try:
                data = sock.recv(4096)
            except socket.timeout:
                break

            if not data:
                break

            chunks.append(data)
            if b";" in data or b"RPRT" in data:
                break

        reply = b"".join(chunks).replace(b"\x00", b"")
        if b";" in reply:
            reply = reply[: reply.index(b";") + 1]
        return reply


def handle_command(endpoint, command):
    command = command.strip()
    if not command:
        return b""

    upper = command.upper()
    expect_reply = upper in READ_COMMANDS
    logging.info("CAT %s%s", upper, " (read)" if expect_reply else "")

    try:
        reply = rigctld_raw(endpoint, upper, expect_reply)
    except Exception:
        logging.exception("rigctld command failed: %s", upper)
        return b""

    if reply:
        logging.info("CAT reply %r", reply)
    return reply


def main():
    parser = argparse.ArgumentParser(
        description="Raw Kenwood CAT bridge for OmniRig -> rigctld without Hamlib target-VFO polling."
    )
    parser.add_argument("--serial-port", default=r"\\.\COM10")
    parser.add_argument("--baud", type=int, default=115200)
    parser.add_argument("--rigctld", default="127.0.0.1:4532")
    parser.add_argument(
        "--log",
        default=os.path.join(
            os.environ.get("USERPROFILE", "."), "safe-ts590-omnirig-bridge.log"
        ),
    )
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(
        filename=args.log,
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )
    console = logging.StreamHandler(sys.stderr)
    console.setLevel(logging.DEBUG if args.verbose else logging.INFO)
    console.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    logging.getLogger().addHandler(console)

    logging.info(
        "Starting safe TS-590 OmniRig bridge: %s at %s -> %s",
        args.serial_port,
        args.baud,
        args.rigctld,
    )

    with serial.Serial(args.serial_port, args.baud, timeout=0.1, write_timeout=1.0) as port:
        buffer = bytearray()
        while True:
            data = port.read(256)
            if data:
                buffer.extend(data)

            while b";" in buffer:
                idx = buffer.index(ord(";"))
                raw = bytes(buffer[: idx + 1])
                del buffer[: idx + 1]

                try:
                    command = raw.decode("ascii", errors="ignore")
                except UnicodeDecodeError:
                    logging.warning("Ignoring undecodable CAT bytes: %r", raw)
                    continue

                reply = handle_command(args.rigctld, command)
                if reply:
                    port.write(reply)
                    port.flush()


if __name__ == "__main__":
    main()
