
    // ---- LEAFLET MAP ----
    const map = L.map("map").setView([-12.9764, -38.4814], 14); // <--- TROQUE PARA SUA CIDADE

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Clínicas no Mapa
    const locais = [
      {
        nome: "UPA Parque São Cristovão",
        coords: [-12.975, -38.482],
        cor: "green"
      },
      {
        nome: "USF Parque São Cristovão",
        coords: [-12.978, -38.480],
        cor: "orange"
      }
    ];

    locais.forEach(local => {
      L.marker(local.coords, {
        icon: L.divIcon({
          className: "custom-marker",
          html: `<div style="background:${local.cor}; width:20px; height:20px; border-radius:50%;"></div>`
        })
      })
      .addTo(map)
      .bindPopup(`<b>${local.nome}</b><br><button onclick="alert('Abrir detalhes');">Ver detalhes</button>`);
    });