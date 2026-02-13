#!/bin/bash

WLAN_IF="wlan0"
AP_IP="192.168.50.1"
SUBNET="192.168.50.0/24"
DNSMASQ_CONF="./captive_dnsmasq.conf"
HOSTAPD_CONF="./hostapd.conf"

echo "[+] Stopping any running instances..."
sudo pkill hostapd 2>/dev/null
sudo pkill dnsmasq 2>/dev/null

echo "[+] Setting up $WLAN_IF with IP $AP_IP ..."
sudo ip link set $WLAN_IF down
sudo ip addr flush dev $WLAN_IF
sudo ip addr add $AP_IP/24 dev $WLAN_IF
sudo ip link set $WLAN_IF up

# enable IP forwarding
sudo sysctl -w net.ipv4.ip_forward=1

# assume eth0 is your Internet interface
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT

echo "[+] Starting dnsmasq..."
sudo dnsmasq -C "$DNSMASQ_CONF" -d > /tmp/dnsmasq_ap.log 2>&1 &

echo "[+] Starting hostapd..."
sudo hostapd "$HOSTAPD_CONF" -dd > /tmp/hostapd_ap.log 2>&1 &

sleep 2
echo "[+] AP started. Logs:"
echo "    dnsmasq: /tmp/dnsmasq_ap.log"
echo "    hostapd: /tmp/hostapd_ap.log"
echo "[+] You can check with: sudo ss -lntu | grep -E '67|68|53|80'"