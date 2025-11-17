
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

# === Перевірка, що ми у Live середовищі ===
if [[ ! -e /usr/bin/pacstrap ]]; then
  echo "❌ Скрипт потрібно запускати з Arch Live середовища."
  exit 1
fi

# === Перевірка режиму завантаження ===
if [[ ! -d /sys/firmware/efi ]]; then
    echo "❌ Система не в UEFI режимі. Скрипт працює тільки з UEFI."
    exit 1
fi

# === Показ усіх дисків ===
echo "📦 Доступні пристрої:"
lsblk -dpno NAME,SIZE | grep -E "usb|sd|nvme|vd"

# === Вибір диску ===
read -rp "Введіть шлях до зовнішнього SSD (наприклад, /dev/sda): " DISK
if [[ ! -b "$DISK" ]]; then
  echo "❌ Некоректний диск."
  exit 1
fi

# Запобігти випадковому вибору системного диска
SYSTEM_DISK=$(lsblk -ndo NAME,RO | grep "1" | cut -d' ' -f1)
if [[ "$DISK" == "/dev/$SYSTEM_DISK" ]]; then
    echo "❌ Не можна вибирати системний диск!"
    exit 1
fi

# Запит підтвердження перед небезпечними операціями
echo "⚠️  УВАГА: Всі дані на $DISK будуть видалені!"
read -rp "Продовжити? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Відмінено."
    exit 0
fi

# === Введення імені користувача ===
read -rp "Ім’я користувача: " USERNAME
read -rp "Hostname: " HOSTNAME

read -s -p "Пароль користувача: " USERPASS
echo
read -s -p "Пароль root: " ROOTPASS
echo

# === Розмітка диску ===
echo "💽 Створення таблиці GPT..."
sgdisk -Z "$DISK" >/dev/null
sgdisk -n1:0:+512M -t1:ef00 -c1:"EFI System" "$DISK"
sgdisk -n2:0:0     -t2:8300 -c2:"Arch Linux" "$DISK"

TIMEZONE="CET"
EFI="${DISK}1"
ROOT="${DISK}2"

# === Форматування ===
echo "🧽 Форматування..."
mkfs.vfat -F32 "$EFI"
mkfs.ext4 -F "$ROOT"

# === Монтування ===
mount "$ROOT" /mnt
mkdir -p /mnt/boot
mount "$EFI" /mnt/boot

# === Встановлення базової системи ===
echo "📦 Встановлення базових пакетів..."
pacstrap /mnt base linux linux-lts linux-firmware networkmanager vim sudo usbutils pciutils intel-ucode amd-ucode

# === FSTAB ===
genfstab -U /mnt >> /mnt/etc/fstab

# === Налаштування системи ===
arch-chroot /mnt /bin/bash <<EOF
set -e

echo "$HOSTNAME" > /etc/hostname  

ln -sf /usr/share/zoneinfo/$TIMEZONE /etc/localtime
hwclock --systohc

sed -i 's/^#en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf

# Користувач
useradd -m -G wheel -s /bin/bash "$USERNAME"

echo "$USERNAME:$USERPASS" | chpasswd
echo "root:$ROOTPASS" | chpasswd

sed -i 's/^# %wheel ALL=(ALL:ALL) ALL/%wheel ALL=(ALL:ALL) ALL/' /etc/sudoers

# mkinitcpio optimize
sed -i 's/^HOOKS=.*/HOOKS=(base systemd udev autodetect modconf block keyboard filesystems fsck)/' /etc/mkinitcpio.conf
sed -i 's/^MODULES=.*/MODULES=(usbhid usb_storage uas xhci_pci ehci_pci ohci_pci ahci ext4)/' /etc/mkinitcpio.conf
mkinitcpio -P

# systemd-boot
bootctl install

ROOT_UUID=\$(blkid -s UUID -o value "$ROOT")

# kernel config
cat <<BOOT > /boot/loader/entries/arch.conf
title   Arch Linux (USB)
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=UUID=\$ROOT_UUID rw add_efi_memmap iommu=soft
BOOT

# LTS kernel config
cat <<LTS > /boot/loader/entries/arch-lts.conf
title Arch Linux LTS
linux /vmlinuz-linux-lts
initrd /initramfs-linux-lts.img
options root=UUID=\$ROOT_UUID rw add_efi_memmap iommu=soft usbcore.autosuspend=-1
LTS

# loader config
cat <<LOADER > /boot/loader/loader.conf
default arch
timeout 3
editor 0
LOADER

# NetworkManager
systemctl enable NetworkManager

EOF

echo "✅ Готово! Можеш перезавантажитися і вибрати USB SSD у BIOS."
echo "💡 Після першого запуску: systemctl enable --now NetworkManager"
