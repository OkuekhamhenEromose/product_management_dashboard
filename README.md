# 🛍️ Product Management Dashboard

A modern, responsive product management dashboard built with **Next.js (App Router)**, designed to simulate a real-world e-commerce admin interface.

This project demonstrates strong frontend engineering skills, including state management, UI architecture, component design, and mock API integration.

---

## 🚀 Live Features

* 📦 Product listing with pagination
* 🔍 Search and filtering system
* ⭐ Ratings display (Material Icons)
* 🏷️ Featured, deals, and stock indicators
* ➕ Add / Edit product modal
* 🗑️ Delete confirmation modal
* 📊 Dashboard summary (stats overview)
* 🖼️ Local image handling (no external dependency)

---

## 🧠 Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + custom styles
* **Icons:** Google Material Icons (CDN)
* **State:** React hooks
* **Data Layer:** Mock API with localStorage persistence

---

## 📁 Project Structure

```
app/
 ├── page.tsx              # Main dashboard page
 ├── layout.tsx            # Root layout + fonts + icons
components/
 ├── ProductTable.tsx
 ├── DashboardExtras.tsx
 ├── SearchFilter.tsx
 ├── ProductModal.tsx
 ├── DeleteModal.tsx
services/
 ├── mockProductApi.ts     # Mock backend logic
public/
 ├── images/               # Local product images
```

---

## ⚙️ Setup & Installation

```bash
git clone <repo-url>
cd product-management-dashboard
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🖼️ Image Handling

All product images are stored locally:

```
/public/images/
```

Accessed via:

```
/images/filename.jpg
```

This avoids external API delays and ensures fast loading.

---

## 🧩 Mock API System

The project includes a fully simulated backend:

* `fetchProducts()` → pagination, filtering, sorting
* `fetchProduct()` → single item retrieval
* `createProduct()` → add product
* `updateProduct()` → edit product
* `deleteProduct()` → remove product

Data is persisted using:

```
localStorage (shopa_mock_products)
```

---

## ⚠️ Development Note

If old data (e.g. Unsplash images) appears, clear local storage:

```js
localStorage.removeItem('shopa_mock_products');
location.reload();
```

---

## 🎯 Design Decisions

* Used **Material Icons CDN** instead of heavy UI libraries for performance and speed
* Structured components for **reusability and scalability**
* Built mock API to simulate **real backend behavior**
* Focused on **UX clarity** (modals, feedback, states)

---

## 💡 What This Demonstrates

* Clean component architecture
* Real-world dashboard UI patterns
* Strong understanding of data flow
* Ability to simulate backend logic
* Attention to performance and delivery speed

---

## 📌 Future Improvements

* Integrate real backend (REST/GraphQL)
* Add authentication & role-based access
* Implement dark mode
* Use `next/image` optimization
* Add unit & integration tests

---

## 👨‍💻 Author

Built as part of a frontend assessment task.

---

## ⭐ Summary

This project reflects my ability to:

* Deliver under time constraints
* Make practical engineering trade-offs
* Build scalable frontend systems
* Think beyond UI into product behavior

---

**Thank you for reviewing 🙌**
