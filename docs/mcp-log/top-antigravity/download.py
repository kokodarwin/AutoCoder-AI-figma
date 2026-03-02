import os
import urllib.request
import json
import ssl

TOKEN=os.environ.get("FIGMA_ACCESS_TOKEN", "")
FILE_KEY="gaau2jhfNSbjm3ui50Du74"
OUT_DIR="src/img/top-antigravity"

os.makedirs(OUT_DIR, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

pngs = {
  "2071:4306": "fv-bg",
  "2071:3784": "fv-cert1",
  "2071:3785": "fv-cert2",
  "2071:3828": "concept-bg",
  "2071:3837": "service-bg",
  "2071:3846": "service-item1",
  "2071:3855": "service-item2",
  "2071:3863": "service-item3",
  "2071:3870": "service-item4",
  "2071:3879": "service-item5",
  "2071:3884": "service-item6"
}

print("Downloading PNGs...")
req = urllib.request.Request(f"https://api.figma.com/v1/images/{FILE_KEY}?ids={','.join(pngs.keys())}&format=png&scale=2")
req.add_header("X-Figma-Token", TOKEN)
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode())
        for node_id, filename in pngs.items():
            url = data.get("images", {}).get(node_id)
            if url:
                print(f"Downloading {filename}.png")
                urllib.request.urlretrieve(url, f"{OUT_DIR}/{filename}.png")
            else:
                print(f"Failed to get URL for {filename} ({node_id})")
except Exception as e:
    print(f"Error: {e}")

svgs = {
  "2071:3799": "icon-mail",
  "2071:3826": "icon-arrow"
}

print("Downloading SVGs...")
req = urllib.request.Request(f"https://api.figma.com/v1/images/{FILE_KEY}?ids={','.join(svgs.keys())}&format=svg")
req.add_header("X-Figma-Token", TOKEN)
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode())
        for node_id, filename in svgs.items():
            url = data.get("images", {}).get(node_id)
            if url:
                print(f"Downloading {filename}.svg")
                urllib.request.urlretrieve(url, f"{OUT_DIR}/{filename}.svg")
            else:
                print(f"Failed to get URL for {filename} ({node_id})")
except Exception as e:
    print(f"Error: {e}")

print("Download completed.")
