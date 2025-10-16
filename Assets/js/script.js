const image = document.getElementById('image');
const imgFile = document.getElementById('imgFile');

const filters = {
  brightness : 100,
  contrast : 100,
  saturate : 100,
  grayscale : 0,
  sepia : 0,
  hue : 0,
  blur : 0
};

let rotate = 0;
let flipH = 1;
let flipV = 1;

imgFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const url = URL.createObjectURL(file);
  image.src = url;
  image.style.display = 'block';
});

document.querySelectorAll('.controls input[type="range"]').forEach(input => {
  input.addEventListener('input', (e) => {
    filters[e.target.id] = e.target.value;
    applyFilters();
  });
});

document.getElementById('rotateLeft').addEventListener('click', () => {
  rotate -=90;
  applyFilters();
});

document.getElementById('rotateRight').addEventListener('click', () => {
  rotate += 90;
  applyFilters();
});

document.getElementById('flipH').addEventListener('click', () => {
  flipH *= -1;
  applyFilters();
});

document.getElementById('flipV').addEventListener('click', () => {
  flipV *= -1;
  applyFilters();
});

document.getElementById('reset').addEventListener('click', () => {
  Object.assign(filters, {
    brightness : 100,
    contrast : 100,
    saturate : 100,
    grayscale : 0,
    sepia : 0,
    hue : 0,
    blur : 0
  });
      rotate = 0;
      flipH = 1;
      flipV = 1;
      document.querySelectorAll('.controls input[type="range"]').forEach(input => {
        input.value = filters[input.id];
      });
  applyFilters();
});

function applyFilters() {
  image.style.filter = `
  brightness(${filters.brightness}%)
  contrast(${filters.contrast}%)
  saturate(${filters.saturate}%)
  grayscale(${filters.grayscale}%)
  sepia(${filters.sepia}%)
  hue-rotate(${filters.hue}deg)
  blur(${filters.blur}px)
  `;
  image.style.transform = `
  rotate(${rotate}deg)
  scale(${flipH},${flipV})
  `;
}

// Download Edited Image
document.getElementById('download').addEventListener('click', () => {
  if(!image.src) return alert("Pleace Upload an Image First!");
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const tempImg = new Image();
  tempImg.src = image.src;
  tempImg.onload = () => {
    canvas.width = tempImg.width;
    canvas.height = tempImg.height;

    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturate}%)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
    `

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipH,flipV);
    ctx.drawImage(tempImg, -tempImg.width / 2, -tempImg.height / 2);
        
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = canvas.toDataURL();
        link.click();
  }
});