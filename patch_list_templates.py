from pathlib import Path

replacements = [
    ('src/views/categories.ejs', '<ul>\n\n            <% categories.forEach(category => { %>\n\n                <li><a href="/categories/<%= category.category_id %>">', '<ul class="list-cards auto">\n\n            <% categories.forEach(category => { %>\n\n                <li class="card"><a href="/categories/<%= category.category_id %>">'),
    ('src/views/projects.ejs', '<ul>\n\n            <% projects.forEach(project=> { %>\n\n                <li>\n\n                    <strong>\n', '<ul class="list-cards auto">\n\n            <% projects.forEach(project=> { %>\n\n                <li class="card">\n\n                    <strong>\n'),
    ('src/views/organizations.ejs', '<ul>\n            \n            <% organizations.forEach(organization=> { %>\n\n                <li><img src="/images/<%= organization.logo_filename %>" alt="<%= organization.name %> logo"><a href="/organizations/<%= organization.organization_id %>">', '<ul class="list-cards auto">\n            \n            <% organizations.forEach(organization=> { %>\n\n                <li class="card"><img src="/images/<%= organization.logo_filename %>" alt="<%= organization.name %> logo"><a href="/organizations/<%= organization.organization_id %>">'),
    ('src/views/category.ejs', '<ul>\n        \n            <% projects.forEach(project => { %>\n        \n                <li>\n                    <a href="/project/<%= project.project_id %>">', '<ul class="list-cards auto">\n        \n            <% projects.forEach(project => { %>\n        \n                <li class="card">\n                    <a href="/project/<%= project.project_id %>">'),
    ('src/views/project.ejs', '<h3>Categories</h3>\n\n            <ul>\n\n                <% categories.forEach(cat=> { %>\n\n                    <li>\n', '<h3>Categories</h3>\n\n            <ul class="list-cards chips">\n\n                <% categories.forEach(cat=> { %>\n\n                    <li>\n'),
]

for path, old, new in replacements:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"Missing file {path}")
    text = p.read_text(encoding='utf-8')
    if old not in text:
        raise ValueError(f"Pattern not found in {path}")
    p.write_text(text.replace(old, new), encoding='utf-8')
    print(f"Updated {path}")
