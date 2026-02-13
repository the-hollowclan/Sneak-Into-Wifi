# SNEAK-INTO-WIFI
An AP setup utility, with captive portal to perform a controlled Evil-Twin that automatically pops up once client connects to this passwordless AP setup.
Furthermore, the auto popup will show nearby WiFi devices, enforce the client to enable speed mode. 
This setup excels in Wifi Phishing.

## Tested on RTL8188FU driver on RTL Wifi Adapter, certain to run on Atheros, TP-Link with AP mode or monitor mode support out-of-the-box.
## Adapters like 

## How To Use (Debug Mode) 

You can edit WiFi AP Name or SSID in ./hostapd+dnsmasq/
You can also edit the 

```bash 
┌──(kali㉿vbox)-[/]
└─$ git clone https://github.com/the-hollowclan/Sneak-Into-Wifi
```

```bash
┌──(kali㉿vbox)-[/]
└─$ cd Sneak-Into-Wifi/hostapt+dnsmasq/ && sudo bash start_captive.sh
```
#### Add new session tab in your terminal and run this immediately

```bash
┌──(kali㉿vbox)-[/]
└─$ cd Sneak-Into-Wifi/captive_portal && sudo python server.py
```

## Use this responsibly
