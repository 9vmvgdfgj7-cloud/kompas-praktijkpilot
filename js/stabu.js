window.KompasDevelopment = {
  render(rows, items) {
    rows.innerHTML = items.map(item =>
      `<tr><td>${item.item}</td><td>${item.status}</td></tr>`
    ).join("");
  }
};
