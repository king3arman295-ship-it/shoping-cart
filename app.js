const PRODUCTS = [
  {id:1,name:"Wireless Earbuds",cat:"Electronics",price:3499,e:"🎧",c:"#cfe8ff"},
  {id:2,name:"Smart Watch",cat:"Electronics",price:6999,e:"⌚",c:"#d9d2ff"},
  {id:3,name:"Power Bank 10000mAh",cat:"Electronics",price:2499,e:"🔋",c:"#d3f2dc"},
  {id:4,name:"Bluetooth Speaker",cat:"Electronics",price:4299,e:"🔊",c:"#ffe1c7"},
  {id:5,name:"Cotton Kurta",cat:"Clothing",price:2899,e:"👕",c:"#ffd6dc"},
  {id:6,name:"Denim Jacket",cat:"Clothing",price:5499,e:"🧥",c:"#cfdcff"},
  {id:7,name:"Running Shoes",cat:"Clothing",price:6299,e:"👟",c:"#fff0b8"},
  {id:8,name:"Wool Cap",cat:"Clothing",price:899,e:"🧢",c:"#e3d6c8"},
  {id:9,name:"Ceramic Mug Set",cat:"Home",price:1599,e:"☕",c:"#ffe6c2"},
  {id:10,name:"Desk Lamp",cat:"Home",price:2199,e:"💡",c:"#fff5b0"},
  {id:11,name:"Cushion Cover Pair",cat:"Home",price:1199,e:"🛋️",c:"#e2d3f5"},
  {id:12,name:"Backpack",cat:"Bags",price:3199,e:"🎒",c:"#c9eadf"},
  {id:13,name:"Leather Wallet",cat:"Bags",price:1799,e:"👛",c:"#f1d7c3"},
  {id:14,name:"Notebook Pack (5)",cat:"Stationery",price:699,e:"📓",c:"#d6e9ff"},
  {id:15,name:"Gel Pens (12)",cat:"Stationery",price:449,e:"🖊️",c:"#ffd9e8"},
  {id:16,name:"Water Bottle 1L",cat:"Home",price:999,e:"🧴",c:"#cdeef2"}
];
const $ = s => document.querySelector(s);
const money = n => "Rs " + n.toLocaleString("en-PK");
let cat = "All", cart = load();

function load(){ try { return JSON.parse(localStorage.getItem("bazaar-cart")) || {}; } catch { return {}; } }
function save(){ try { localStorage.setItem("bazaar-cart", JSON.stringify(cart)); } catch {} }

function renderCats(){
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.cat))];
  $("#cats").innerHTML = cats.map(c => `<button class="${c===cat?"on":""}" data-c="${c}">${c}</button>`).join("");
}
function renderGrid(){
  const q = $("#search").value.trim().toLowerCase(), s = $("#sort").value;
  let list = PRODUCTS.filter(p => (cat==="All"||p.cat===cat) && p.name.toLowerCase().includes(q));
  if (s==="low") list.sort((a,b)=>a.price-b.price);
  if (s==="high") list.sort((a,b)=>b.price-a.price);
  $("#grid").innerHTML = list.map(p => `
    <article class="card">
      <div class="thumb" style="background:${p.c}">${p.e}</div>
      <div class="info"><h3>${p.name}</h3><small>${p.cat}</small>
        <div class="buy"><span class="price">${money(p.price)}</span>
        <button class="add" data-id="${p.id}">Add to cart</button></div></div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
}
function renderCart(){
  const ids = Object.keys(cart);
  let total = 0, count = 0;
  $("#items").innerHTML = ids.length ? ids.map(id => {
    const p = PRODUCTS.find(x => x.id == id), q = cart[id];
    total += p.price * q; count += q;
    return `<div class="item"><div class="e">${p.e}</div>
      <div><b>${p.name}</b><small>${money(p.price)}</small></div>
      <div class="qty"><button data-d="-1" data-id="${id}" aria-label="Remove one">−</button>${q}<button data-d="1" data-id="${id}" aria-label="Add one">+</button></div></div>`;
  }).join("") : `<p class="empty">Your cart is empty. Add something from the shop.</p>`;
  $("#total").textContent = money(total);
  $("#count").textContent = count;
  $("#checkout").disabled = !ids.length;
  save();
}
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1800); }
function drawer(open){ $("#drawer").classList.toggle("open", open); $("#overlay").hidden = !open; }

$("#cats").onclick = e => { if (e.target.dataset.c) { cat = e.target.dataset.c; renderCats(); renderGrid(); } };
$("#search").oninput = renderGrid;
$("#sort").onchange = renderGrid;
$("#grid").onclick = e => {
  const id = e.target.dataset.id; if (!id) return;
  cart[id] = (cart[id] || 0) + 1; renderCart();
  toast(PRODUCTS.find(p => p.id == id).name + " added to cart");
};
$("#items").onclick = e => {
  const id = e.target.dataset.id, d = +e.target.dataset.d; if (!id) return;
  cart[id] += d; if (cart[id] <= 0) delete cart[id]; renderCart();
};
$("#cartBtn").onclick = () => drawer(true);
$("#close").onclick = $("#overlay").onclick = () => drawer(false);
$("#checkout").onclick = () => $("#dlg").showModal();
$("#form").onsubmit = e => {
  if (e.submitter && e.submitter.value === "ok") {
    cart = {}; renderCart(); drawer(false);
    toast("Order placed. We'll call you to confirm.");
  }
};
renderCats(); renderGrid(); renderCart();
