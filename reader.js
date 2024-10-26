function calculateXY(d1, d2, d3) {
    const x = [];
    const y = [];
  
    for (let i = 0; i < a.length; i++) {
      x.push((Math.pow(d1, 2) - Math.pow(d2, 2) + 56.25) / 15);
      y.push((Math.pow(d1, 2) - Math.pow(d3, 2) + 56.25) / 15);
    }
  
    return { x, y };
  }
  