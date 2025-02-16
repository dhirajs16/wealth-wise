# Laravel Project Setup

[Docs](https://laravel.com/docs/11.x/installation) |

## **How to start a laravel project?**

**Step 1**: Install `php`, `composer` and `laravel installer` with windows powershell cli, opened with administrator mode.

```
# Run as administrator...
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))

```

**step 2**: Create a new Laravel project using the following command in PowerShell:

```bash
laravel new myproject
```
Replace myproject with your desired project name.

**Step 3**: Navigate into Your Project Directory
Change into your newly created project directory:

```bash
cd myproject
```
**Step 3**: Start Development Server
To start the development server for testing purposes, use Artisan's serve command:

```bash
php artisan serve  
```
This will make your application accessible at `http://127.0.0.1:8000`.