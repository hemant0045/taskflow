# TaskFlow — React frontend project

A responsive task management app built with React 19.3, TypeScript, and Vite. It is frontend-only and stores tasks and theme preference in browser localStorage.

## Requirements
- Node.js 20.19+ or 22.12+ (recommended for Vite 8)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL shown in your terminal (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Features
- Add, edit, delete, complete tasks
- Search tasks and filter by priority
- Views for All tasks, Today, Upcoming, Completed, and categories
- Dashboard statistics and completion rate
- Responsive mobile layout
- Light/dark theme
- Local persistence with localStorage

No backend or database is included. Data remains in the current browser profile and is not synced across devices.

# Docker and Kubernetes Commands

This README contains commonly used Docker and Kubernetes commands for checking versions, managing containers, viewing logs, and managing Kubernetes clusters.

## 1. Docker Commands

### Check Docker Version
```bash
docker --version
```
Displays the installed Docker version.

### List Docker Images
```bash
docker images
```
Displays all downloaded Docker images.

### List All Containers
```bash
docker ps -a
```
Displays all running and stopped containers.

### Check Container Logs
```bash
docker logs taskflow-container
```
Displays logs of the `taskflow-container`.

### Stop Docker Container
```bash
docker stop taskflow-container
```
Stops the running Taskflow container.

### Start Docker Container
```bash
docker start taskflow-container
```
Starts the stopped Taskflow container.

---

## 2. Kubernetes Commands

### Check Kubernetes Client Version
```bash
kubectl version --client
```
Displays the installed kubectl client version.

### Get Kubernetes Nodes
```bash
kubectl get nodes
```
Displays all nodes in the Kubernetes cluster.

### Get Kubernetes Contexts
```bash
kubectl config get-contexts
```
Displays all available Kubernetes contexts.

### Switch Kubernetes Context
```bash
kubectl config use-context docker-desktop
```
Switches the current Kubernetes context to Docker Desktop.

### Verify Kubernetes Nodes
```bash
kubectl get nodes
```
Checks whether the Kubernetes cluster is accessible.

---

## 3. All Commands in One Place

### Docker
```bash
docker --version
docker images
docker ps -a
docker logs taskflow-container
docker stop taskflow-container
docker start taskflow-container
```

### Kubernetes
```bash
kubectl version --client
kubectl get nodes
kubectl config get-contexts
kubectl config use-context docker-desktop
kubectl get nodes
```

---

## 4. Prerequisites

Before executing these commands, make sure:

1. Docker Desktop is installed.
2. Docker Desktop is running.
3. Kubernetes is enabled in Docker Desktop.
4. kubectl is installed.
5. The `taskflow-container` exists before running container-specific commands.

---

## 5. Important Notes

- `docker stop` stops a container but does not delete it.
- `docker start` starts an existing stopped container.
- `docker images` lists locally available images.
- `docker ps -a` shows both running and stopped containers.
- `kubectl get nodes` verifies Kubernetes cluster connectivity.
- `kubectl config use-context docker-desktop` selects the Docker Desktop Kubernetes cluster.

---

## 6. Technologies Used

- Docker
- Docker Desktop
- Kubernetes
- kubectl

**Purpose:** Basic Docker container management and Kubernetes cluster verification.
