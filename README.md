# 📦 PlusMove Delivery Management System

A Laravel + Inertia-based system to manage and track deliveries for PlusMove across multiple cities. It includes real-time delivery tracking, driver assignment logic, customer notifications, and daily reporting of undelivered packages.

---

## 🚀 Features

- Role-based access control (`Admin`)
- Assign deliveries to drivers with minimal current load
- Real-time delivery tracking & status updates
- Daily cron job to mark undelivered packages as returns
- API for mobile or third-party integration
- Background jobs for notifications
- Clean Inertia.js-based frontend
- Secure authentication & authorization

---

## 🧰 Tech Stack

- **Backend**: Laravel 10+
- **Frontend**: Inertia.js + React
- **Database**: MySQL 
- **Queue Driver**: Database (can be changed to Redis)
- **Scheduler**: Laravel `schedule:run` (cron job)

---

## ⚙️ Setup Instructions

###  Prerequisites (Linux)

1. Create account with mailtrap https://mailtrap.io/ and replace MAIL keys in the .env

Ensure the following software is installed:

```bash
sudo apt update && sudo apt install -y \
  php php-cli php-mbstring php-xml php-bcmath php-curl php-mysql php-zip \
  composer \
  npm \
  mysql-server

download composer : https://getcomposer.org/download/

=>sudo service mysql start
=>create a database named plus_move
=>import plus_move.sql to plus_move database


#######################################################################################

### 1. Clone/Download the repository
cd PlusMove

composer install
npm install && npm run build

Run the App
php artisan serve

⏱️ Background Jobs & Scheduling
php artisan custom:ensure-workers

📬 Contact

    Built with ❤️ by Tsheko Kutumela for the PlusMove Laravel Assessment.
    📧 Email: tshekokutumela@gmail.com
    🌐 Portfolio: https://kutumela.netlify.app.com


# plus_move
