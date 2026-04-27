# 🛍️ Product Management Dashboard

A modern, responsive product management dashboard built with **Next.js (App Router)** and **TypeScript**, designed to simulate a real-world e-commerce admin interface.

This project was developed as part of a frontend technical assessment to demonstrate practical skills in UI development, state handling, and frontend architecture.

---

## 🚀 Features

* 📦 Product listing with pagination
* 🔍 Search and filtering functionality
* ➕ Add new product (modal form)
* ✏️ Edit existing product
* 🗑️ Delete confirmation modal
* ⭐ Product ratings display
* 🏷️ Featured / deals / stock indicators
* 📊 Dashboard summary (product stats)
* 🖼️ Local image handling (no external API dependency)
* 📱 Fully responsive design

---

## 🧠 Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + custom styles
* **Icons:** Google Material Icons (CDN)
* **State Management:** React Hooks
* **Data Layer:** Custom mock API (localStorage-based)

---

## 📁 Project Structure

```
app/
 ├── layout.tsx
 ├── page.tsx

components/
 ├── ProductTable.tsx
 ├── DashboardExtras.tsx
 ├── SearchFilter.tsx
 ├── ProductModal.tsx
 ├── DeleteModal.tsx

services/
 ├── mockProductApi.ts

public/
 ├── images/
```

---

## ⚙️ Setup & Installation

Follow these steps to run the project locally.

### 1. Clone the Repository

```
git clone <your-repo-url>
cd product-management-dashboard
```

---

### 2. Install Dependencies

```
npm install
```

---

### 3. Run Development Server

```
npm run dev
```

---

### 4. Open in Browser

```
http://localhost:3000
```

---

## 🧪 Data & Mock API

The project uses a **custom mock API layer** to simulate backend behavior.

Features include:

* Pagination
* Filtering and search
* Sorting
* CRUD operations (Create, Read, Update, Delete)

Data is stored in:

```
localStorage (key: shopa_mock_products)
```

---

## ⚠️ Resetting Data (Important)

If older data (e.g., Unsplash images) appears:

```
localStorage.removeItem('shopa_mock_products');
location.reload();
```

---

## 🖼️ Image Handling

All images are stored locally for performance and reliability.

```
/public/images/
```

Example usage:

```
/images/silvernecklace3.jpg
```

### Requirements

* File names must match exactly (case-sensitive)
* Incorrect paths will result in broken images

---

## 🛠️ Troubleshooting

**Images not showing**

* Check filenames and extensions
* Confirm files exist in `/public/images`

**Old data still showing**

* Clear localStorage (see reset section)

**App not starting**

* Ensure Node.js ≥ 18
* Re-run `npm install`

---

## 🧠 Technical Decisions

This project was built with a focus on **performance, simplicity, and real-world frontend architecture under time constraints**.

### 1. Custom Mock API (localStorage)

Instead of external services (e.g., mockapi.io), a local mock API was implemented.

**Why:**

* No network dependency
* Full CRUD simulation
* Faster and reliable for demo/testing
* Works offline

---

### 2. Material Icons via CDN

Used Google Material Icons instead of installing full UI libraries.

**Why:**

* Eliminates heavy dependencies
* Faster setup and build time
* Avoids compatibility issues
* Maintains clean UI design

---

### 3. Component-Based Architecture

UI split into reusable components:

* ProductTable
* DashboardExtras
* SearchFilter
* ProductModal
* DeleteModal

**Why:**

* Improves scalability
* Encourages maintainability
* Clear separation of concerns

---

### 4. Local Image Strategy

Moved from external image sources (Unsplash) to local assets.

**Why:**

* Faster loading
* No external API reliance
* Stable demo experience

---

### 5. State Management (React Hooks)

Used native React state instead of external libraries.

**Why:**

* Keeps implementation simple
* Appropriate for project scale
* Reduces unnecessary complexity

---

### 6. UX Considerations

Implemented:

* Loading states
* Error handling
* Image fallbacks

**Why:**

* Improves usability
* Reflects real-world production practices

---

### 7. Trade-Offs

Given the time constraint, priority was placed on:

* Clean and maintainable code
* Functional completeness
* Performance

Rather than:

* Heavy UI frameworks
* Advanced state libraries

---

## 📸 Screenshots

(Add screenshots here before submission)

Suggested:

* Dashboard view
* Product modal
* Search/filter interaction

---

## 📌 Future Improvements

* Integrate real backend API
* Add authentication & role-based access
* Implement dark mode
* Optimize images using `next/image`
* Add unit and integration tests

---

## 👨‍💻 Author

Built as part of a frontend technical assessment.

---

## ⭐ Summary

This project demonstrates:

* Strong frontend architecture
* Real-world dashboard design patterns
* Ability to simulate backend systems
* Practical decision-making under time constraints

---

**Thank you for reviewing 🙌**
