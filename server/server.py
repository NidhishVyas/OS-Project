from flask import Flask, jsonify
from flask_cors import CORS
import psutil
from datetime import datetime

app = Flask(__name__)
CORS(app)

is_running = True

prev_net_io = psutil.net_io_counters()


@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    global prev_net_io

    if not is_running:
        return jsonify({"message": "Monitoring is stopped"}), 200

    disk_usage = psutil.disk_usage("/")

    memory = psutil.virtual_memory()

    cpu_count = psutil.cpu_count(logical=True)
    cpu_percent = psutil.cpu_percent(interval=2)

    net_io = psutil.net_io_counters()
    upload_speed = ((net_io.bytes_sent - prev_net_io.bytes_sent) * 8) / 2
    download_speed = ((net_io.bytes_recv - prev_net_io.bytes_recv) * 8) / 2
    prev_net_io = net_io

    boot_time = datetime.fromtimestamp(psutil.boot_time())
    uptime = datetime.now() - boot_time

    processes = sorted(
        psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent"]),
        key=lambda p: p.info["cpu_percent"],
        reverse=True,
    )[:6]

    response = {
        "disk_usage_percent": disk_usage.percent,
        "memory_percent": memory.percent,
        # "cpu_percent": cpu_percent / cpu_count if cpu_count else 0,
        "cpu_percent": cpu_percent,
        "upload_speed": upload_speed,
        "download_speed": download_speed,
        "bytes_sent": net_io.bytes_sent,
        "bytes_recv": net_io.bytes_recv,
        "boot_time": boot_time.strftime("%Y-%m-%d %H:%M:%S"),
        "uptime": str(uptime),
        "top_processes": [
            {
                "pid": proc.info["pid"],
                "name": proc.info["name"],
                # "cpu_percent": proc.info["cpu_percent"],
                "cpu_percent": proc.info["cpu_percent"] / cpu_count if cpu_count else 0,
                "memory_percent": proc.info["memory_percent"],
            }
            for proc in processes
        ],
    }
    return jsonify(response), 200


@app.route("/api/stop", methods=["POST"])
def stop_monitoring():
    global is_running
    is_running = False
    return jsonify({"message": "Monitoring stopped"}), 200


@app.route("/api/start", methods=["POST"])
def start_monitoring():
    global is_running
    is_running = True
    return jsonify({"message": "Monitoring started"}), 200


if __name__ == "__main__":
    app.run(debug=True)
