# EventHub - Organizer Dashboard

## Overview

EventHub Organizer Dashboard is a dedicated management system for event organizers. It provides tools for creating events, managing registrations, monitoring participation, and controlling the complete event lifecycle.

The dashboard focuses on administration, analytics, and operational management.

---

## Features

### Authentication

* Organizer Registration
* Organizer Login
* Secure Authentication
* Role-Based Access Control

### Event Management

* Create Events
* Edit Events
* Delete Events
* Publish Events
* Draft Events
* Event Categories
* Image Upload

### Custom Registration Forms

* Create Dynamic Questions
* Text Inputs
* Number Inputs
* Checkbox Inputs
* Form Configuration Management

### Registration Administration

* View Participants
* Approve Registrations
* Reject Registrations
* Manage Waitlists
* Monitor Event Capacity

### Dashboard Analytics

* Total Events
* Published Events
* Registration Statistics
* Event Performance Metrics

---

## Tech Stack

| Technology      | Purpose            |
| --------------- | ------------------ |
| React 19        | Frontend Framework |
| Vite            | Build Tool         |
| React Router v7 | Routing            |
| Zustand         | State Management   |
| Axios           | API Communication  |
| Bootstrap 5     | UI Components      |
| Tailwind CSS    | Styling            |
| React Toastify  | Notifications      |

---

## Project Structure

```text
src/
├── assets/
├── components/
├── pages/
│   ├── dashboard/
│   ├── events/
│   ├── participants/
│   └── categories/
│
├── services/
├── stores/
├── routes/
├── layouts/
└── utils/
```

---

## Organizer Workflow

```text
Login
  ↓
Dashboard
  ↓
Create Event
  ↓
Configure Custom Form
  ↓
Publish Event
  ↓
Manage Registrations
  ↓
Monitor Participants
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Community-Event-Platform/organizer-dashboard.git

cd organizer-dashboard
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

```env
VITE_API_URL=(ex: https://api.example.com)
```

### Start Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

---

## Key Features

### Event Creation

Organizers can:

* Create free events
* Create paid events
* Upload event images
* Set participant capacity
* Define event categories
* Configure registration requirements

### Registration Management

Organizers can:

* View all registrations
* Approve attendees
* Reject registrations
* Track waitlist positions
* Monitor event capacity

### Custom Form Builder

Supports:

* Text Fields
* Number Fields
* Checkbox Fields

All form structures are stored as JSON and rendered dynamically in the attendee application.

---

## Connected Services

This application communicates with:

```text
community-event-api
```

using RESTful APIs and Laravel Sanctum Authentication.

---

## Team

### Group 5 – Advanced Web Application Development

* Nguyễn Thị Dung
* Nguyễn Tiến Nhựt
* Hồ Thị Vãi
* Hồ Văn Tiết

Passerelles Numériques Vietnam (PNV)
