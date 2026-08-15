# My HTML Notes 📚

A personal knowledge library of HTML notes organized by topic, hosted on **GitHub Pages**.

🌐 **Live site:** `https://<your-username>.github.io/my-html-notes/`

---

## 📁 Folder Structure

```
My HTML Notes/
├── index.html                          ← Homepage (start here)
├── README.md
├── .gitignore
│
├── AWS Learning/                       ← 30 interactive notes & decision trees
├── New AWS Learning Blog/              ← 28 blog-style AWS architecture deep-dives
├── Load Testing Foundation/            ← 3-part ECS & backend performance guides
├── The Visual MBA/                     ← Visual business & finance chapter notes + Hub
├── Udemy A Comprehensive Entrepreneurship Course.../ ← 6 startup & ideation notes
├── Misc/                               ← 5 guides (ACM/TLS, Kafka, OpenSearch, etc.)
└── Youtube Videos/                     ← 5 curated video takeaways & playbooks
```

---

## 🚀 Hosting on GitHub Pages

### Step 1 — Initialize Git & push to GitHub

```bash
cd "/Users/pavanboro/My_Workspace/My HTML Notes"

# Initialize git
git init
git add .
git commit -m "Initial commit: Add homepage and all HTML notes"

# Create a new repo on GitHub (via the website) named: my-html-notes
# Then link it here:
git remote add origin https://github.com/<your-username>/my-html-notes.git
git branch -M main
git push -u origin main
```

### Step 2 — Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, choose **Deploy from a branch**
4. Select **Branch: main** / **Folder: / (root)**
5. Click **Save**

Your site will be live at:
```
https://<your-username>.github.io/my-html-notes/
```

---

## ➕ Adding New Notes

1. Create a new folder (or use an existing one)
2. Add your `.html` file inside it
3. Open `index.html` and add a new `<a class="card" ...>` entry in the appropriate `<section>`
4. Commit & push:
   ```bash
   git add .
   git commit -m "Add new note: <title>"
   git push
   ```

GitHub Pages will automatically redeploy in ~1 minute.

---

## 📝 Tips

- Keep folder names short and meaningful
- Use descriptive HTML file names (e.g., `section7_iam_notes.html`)
- The homepage has a **live search bar** — note titles are searchable instantly

---

*Built with ❤️ using pure HTML & CSS. No frameworks, no build step.*
# My-Notes-Repo
# My-Notes-Repo
