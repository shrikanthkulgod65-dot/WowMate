import os
from PIL import Image, ImageOps

logo_path = "C:/Users/HP/OneDrive/Desktop/wowmarriage/frontend/public/image.png"
res_dir = "C:/Users/HP/OneDrive/Desktop/wowmarriage/frontend/android/app/src/main/res"

if not os.path.exists(logo_path):
    print(f"Error: Logo not found at {logo_path}")
    exit(1)

logo = Image.open(logo_path).convert("RGBA")

# Define densities and launcher icon sizes
launcher_sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192
}

foreground_sizes = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432
}

# Create square icon with padding and white/light background
def make_square_icon(img, size):
    # Create a white background square
    base = Image.new("RGBA", (size, size), (255, 255, 255, 255))

    # Resize logo to fit inside with some padding (e.g., 75% of size)
    target_size = int(size * 0.75)
    img_aspect = img.width / img.height
    if img_aspect > 1:
        w = target_size
        h = int(target_size / img_aspect)
    else:
        h = target_size
        w = int(target_size * img_aspect)

    resized = img.resize((w, h), Image.Resampling.LANCZOS)

    # Paste centered
    x = (size - w) // 2
    y = (size - h) // 2
    base.paste(resized, (x, y), resized)
    return base.convert("RGB")

def make_round_icon(img, size):
    square = make_square_icon(img, size)
    mask = Image.new("L", (size, size), 0)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)

    output = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    output.paste(square, (0, 0))
    output.putalpha(mask)
    return output

# Generate launcher icons
for folder, size in launcher_sizes.items():
    folder_path = os.path.join(res_dir, folder)
    os.makedirs(folder_path, exist_ok=True)

    # ic_launcher.png
    sq_icon = make_square_icon(logo, size)
    sq_icon.save(os.path.join(folder_path, "ic_launcher.png"), "PNG")

    # ic_launcher_round.png
    round_icon = make_round_icon(logo, size)
    round_icon.save(os.path.join(folder_path, "ic_launcher_round.png"), "PNG")

# Generate foreground icons for adaptive launcher
for folder, size in foreground_sizes.items():
    folder_path = os.path.join(res_dir, folder)
    os.makedirs(folder_path, exist_ok=True)

    # Foreground with transparent background (centered logo)
    base = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    target_size = int(size * 0.65)
    img_aspect = logo.width / logo.height
    if img_aspect > 1:
        w = target_size
        h = int(target_size / img_aspect)
    else:
        h = target_size
        w = int(target_size * img_aspect)
    resized = logo.resize((w, h), Image.Resampling.LANCZOS)
    x = (size - w) // 2
    y = (size - h) // 2
    base.paste(resized, (x, y), resized)
    base.save(os.path.join(folder_path, "ic_launcher_foreground.png"), "PNG")

# Generate splash screens
splash_resolutions = {
    "drawable": (960, 1280),
    "drawable-port-mdpi": (320, 480),
    "drawable-port-hdpi": (480, 800),
    "drawable-port-xhdpi": (720, 1280),
    "drawable-port-xxhdpi": (960, 1600),
    "drawable-port-xxxhdpi": (1280, 1920),
    "drawable-land-mdpi": (480, 320),
    "drawable-land-hdpi": (800, 480),
    "drawable-land-xhdpi": (1280, 720),
    "drawable-land-xxhdpi": (1600, 960),
    "drawable-land-xxxhdpi": (1920, 1280),
}

for folder, (w_s, h_s) in splash_resolutions.items():
    folder_path = os.path.join(res_dir, folder)
    os.makedirs(folder_path, exist_ok=True)

    # Create splash background (white or light purple matching the logo background)
    splash_bg = Image.new("RGBA", (w_s, h_s), (255, 255, 255, 255))

    # Scale logo to fit nicely in splash screen (e.g. 50% of min dimension)
    max_logo_size = int(min(w_s, h_s) * 0.5)
    img_aspect = logo.width / logo.height
    if img_aspect > 1:
        w = max_logo_size
        h = int(max_logo_size / img_aspect)
    else:
        h = max_logo_size
        w = int(max_logo_size * img_aspect)

    resized_logo = logo.resize((w, h), Image.Resampling.LANCZOS)
    x = (w_s - w) // 2
    y = (h_s - h) // 2
    splash_bg.paste(resized_logo, (x, y), resized_logo)
    splash_bg.convert("RGB").save(os.path.join(folder_path, "splash.png"), "PNG")

print("Successfully generated all app launcher icons and splash screens from logo!")
