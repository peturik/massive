#!/usr/bin/env bash
set -e

echo "=== Автоматичний Arch USB Installer ==="

# --- Step 1: Detect USB disks ---
echo "Доступні USB диски:"
lsblk -d -o NAME,SIZE,MODEL,TRAN | grep usb || echo "USB-дисків не знайдено!"

echo
read -p "Вкажи USB диск (наприклад sdb): " DISKNAME
DISK="/dev/$DISKNAME"

if [ ! -b "$DISK" ]; then
    echo "❌ Невірний диск!"
    exit 1
fi

echo
echo "❗ УВАГА: Всі дані на $DISK будуть стерті"
read -p "Підтвердити? (yes/no): " confirm
[ "$confirm" != "yes" ] && exit 1

# --- Step 2: Ask for user and passwords ---
read -p "Hostname: " HOSTNAME
read -p "User name: " USERNAME

read -s -p "Password for $USERNAME: " USERPASS
echo
read -s -p "Password for root: " ROOTPASS
echo

TIMEZONE="UTC"

BOOT="${DISK}1"
ROOT="${DISK}2"

echo "✅ Розмітка диска"
sgdisk --zap-all "$DISK"
parted "$DISK" mklabel gpt
parted "$DISK" mkpart EFI fat32 1MiB 512MiB
parted "$DISK" set 1 esp on
parted "$DISK" mkpart ROOT ext4 512MiB 100%

echo "✅ Форматування"
mkfs.fat -F32 "$BOOT"
mkfs.ext4 -F "$ROOT"

echo "✅ Монтування"
mount "$ROOT" /mnt
mkdir -p /mnt/boot
mount "$BOOT" /mnt/boot

echo "✅ Встановлення базової системи"
pacstrap /mnt base linux linux-lts linux-firmware networkmanager sudo vim

echo "✅ Генерація fstab"
genfstab -U /mnt >> /mnt/etc/fstab

echo "✅ Налаштування системи"
arch-chroot /mnt bash <<EOF

# hostname
echo "$HOSTNAME" > /etc/hostname

# timezone
ln -sf /usr/share/zoneinfo/$TIMEZONE /etc/localtime
hwclock --systohc

# locale
sed -i 's/#en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf

# user
useradd -m -G wheel "$USERNAME"

# set passwords
echo "$USERNAME:$USERPASS" | chpasswd
echo "root:$ROOTPASS" | chpasswd

# sudo
sed -i 's/# %wheel ALL=(ALL) ALL/%wheel ALL=(ALL) ALL/' /etc/sudoers

# mkinitcpio optimize
sed -i 's/^HOOKS=.*/HOOKS=(base udev autodetect modconf block keyboard filesystems fsck)/' /etc/mkinitcpio.conf
sed -i 's/^MODULES=.*/MODULES=(usb_storage uas xhci_pci ehci_pci ohci_pci)/' /etc/mkinitcpio.conf
mkinitcpio -P

# bootloader
bootctl install

UUID=$(blkid -s UUID -o value $ROOT)

# loader config
cat <<LOADER > /boot/loader/loader.conf
default arch
timeout 3
editor 0
LOADER

# kernel config
cat <<ARCH > /boot/loader/entries/arch.conf
title Arch Linux
linux /vmlinuz-linux
initrd /initramfs-linux.img
options root=UUID=$UUID rw
ARCH

# LTS kernel config
cat <<LTS > /boot/loader/entries/arch-lts.conf
title Arch Linux LTS
linux /vmlinuz-linux-lts
initrd /initramfs-linux-lts.img
options root=UUID=$UUID rw
LTS

systemctl enable NetworkManager

EOF

echo "✅ Установка завершена!"
echo "Тепер можна reboot."