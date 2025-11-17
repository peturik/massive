#!/usr/bin/env bash
set -e

# === Логування ===
LOG_FILE="/tmp/arch_install_$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

# Функція для обробки помилок
error_handler() {
    echo "❌ Сталася помилка у рядку $1"
    echo "📋 Перевірте лог: $LOG_FILE"
    exit 1
}
trap 'error_handler $LINENO' ERR

# === Конфігурація ===
echo "🖥️  Скрипт встановлення Arch Linux на системний диск"

# === Перевірка UEFI ===
if [[ ! -d /sys/firmware/efi ]]; then
    echo "❌ Цей скрипт працює тільки з UEFI"
    exit 1
fi

# === Перевірка Live середовища ===
if [[ ! -e /usr/bin/pacstrap ]]; then
    echo "❌ Скрипт потрібно запускати з Arch Live середовища."
    exit 1
fi

# === Показ дисків ===
echo "💾 Доступні диски:"
lsblk -dpno NAME,SIZE,MODEL | grep -E "nvme|sd|vd"

# === Вибір диска ===
read -rp "Введіть шлях до системного диска (наприклад, /dev/nvme0n1): " DISK
if [[ ! -b "$DISK" ]]; then
    echo "❌ Некоректний диск."
    exit 1
fi

# === Підтвердження ===
echo "⚠️  УВАГА: Всі дані на $DISK будуть видалені!"
read -rp "Продовжити? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Відмінено."
    exit 0
fi

# === Введення даних ===
read -rp "Ім'я користувача: " USERNAME
read -rp "Hostname: " HOSTNAME

read -s -p "Пароль користувача: " USERPASS
echo
read -s -p "Пароль root: " ROOTPASS
echo

# === Перевірка паролів ===
if [[ ${#USERPASS} -lt 6 ]] || [[ ${#ROOTPASS} -lt 6 ]]; then
    echo "❌ Пароль має бути не менше 8 символів"
    exit 1
fi

# === Розмітка диску ===
echo "💽 Створення таблиці GPT..."
sgdisk -Z "$DISK" >/dev/null
sgdisk -n1:0:+512M -t1:ef00 -c1:"EFI System" "$DISK"
sgdisk -n2:0:+100G -t2:8300 -c2:"Arch Linux" "$DISK"
sgdisk -n3:0:0     -t3:8300 -c3:"Home" "$DISK"

TIMEZONE="Europe/Kiev"
EFI="${DISK}1"
ROOT="${DISK}2"
HOME="${DISK}3"

# === Форматування ===
echo "🧽 Форматування..."
mkfs.vfat -F32 "$EFI"
mkfs.ext4 -F "$ROOT"
mkfs.ext4 -F "$HOME"

# === Монтування ===
mount "$ROOT" /mnt
mkdir -p /mnt/boot
mkdir -p /mnt/home
mount "$EFI" /mnt/boot
mount "$HOME" /mnt/home

# === Встановлення системи ===
echo "📦 Встановлення базових пакетів..."
pacstrap /mnt base base-devel linux linux-lts linux-firmware \
    networkmanager sudo vim bash-completion git curl wget \
    man-db man-pages texinfo intel-ucode amd-ucode \
    os-prober ntfs-3g

# === FSTAB ===
genfstab -U /mnt >> /mnt/etc/fstab

# === Налаштування системи ===
arch-chroot /mnt /bin/bash <<EOF
set -e

echo "$HOSTNAME" > /etc/hostname

# Часова зона
ln -sf /usr/share/zoneinfo/$TIMEZONE /etc/localtime
hwclock --systohc

# Локалізація
sed -i 's/^#en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen
sed -i 's/^#uk_UA.UTF-8/uk_UA.UTF-8/' /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf

# Консоль та клавіатура
echo "KEYMAP=us" > /etc/vconsole.conf
echo "FONT=ter-v16n" >> /etc/vconsole.conf

# Користувачі
useradd -m -G wheel -s /bin/bash "$USERNAME"
echo "$USERNAME:$USERPASS" | chpasswd
echo "root:$ROOTPASS" | chpasswd

# Sudo
sed -i 's/^# %wheel ALL=(ALL:ALL) ALL/%wheel ALL=(ALL:ALL) ALL/' /etc/sudoers

# Оптимізація mkinitcpio для системних дисків
sed -i 's/^HOOKS=.*/HOOKS=(base systemd autodetect modconf block filesystems keyboard fsck)/' /etc/mkinitcpio.conf
mkinitcpio -P

# Завантажувач
bootctl install

ROOT_UUID=\$(blkid -s UUID -o value "$ROOT")

# Конфігурація ядра
cat <<BOOT > /boot/loader/entries/arch.conf
title   Arch Linux
linux   /vmlinuz-linux
initrd  /intel-ucode.img
initrd  /initramfs-linux.img
options root=UUID=\$ROOT_UUID rw
BOOT

# LTS ядро
cat <<LTS > /boot/loader/entries/arch-lts.conf
title Arch Linux LTS
linux /vmlinuz-linux-lts
initrd /intel-ucode.img
initrd /initramfs-linux-lts.img
options root=UUID=\$ROOT_UUID rw
LTS

# Конфігурація завантажувача
echo "default arch.conf" > /boot/loader/loader.conf
echo "timeout 3" >> /boot/loader/loader.conf

# Мережа
systemctl enable NetworkManager

# Додаткові налаштування
echo "kernel.dmesg_restrict=0" >> /etc/sysctl.d/99-custom.conf
EOF

# === Додаткові пакети (опційно) ===
echo "💡 Бажаєте встановити додаткові пакети?"
read -rp "Графічне середовище та драйвери? (y/N): " INSTALL_GUI

if [[ $INSTALL_GUI =~ ^[Yy]$ ]]; then
    arch-chroot /mnt /bin/bash <<'EOF'
    pacman -S --noconfirm xorg xorg-xinit xf86-video-intel xf86-video-amdgpu nvidia nvidia-utils \
        plasma-desktop sddm konsole dolphin firefox chromium \
        pulseaudio pulseaudio-alsa alsa-utils
    systemctl enable sddm
EOF
fi

echo "✅ Встановлення завершено!"
echo "🎉 Можете перезавантажити систему: umount -R /mnt && reboot"
echo "💡 Після встановлення:"
echo "   - Налаштуйте мережу: nmtui"
echo "   - Оновіть систему: sudo pacman -Syu"
echo "   - Додайте користувачів: useradd -m -G wheel -s /bin/bash username"
