
const config = {
  api: "https://test-task.thinnect.net",
};


function createOption(id) {
  var option = document.createElement("option");
  option.value = id;
  option.text = id;
  devices.appendChild(option);
}


function createDevicesHtml(data) {
  const $container = document.getElementById("devices-container");
  $container.innerHTML = "";

  data.forEach(element => {
    console.log('element', element);
    const $div = document.createElement("div");

    if (element.dataType.name == "dt_temperature_C") {
      $div.innerHTML = element.value + "°C Temperature";
      $div.setAttribute('class', 'block temperature');
    } else if (element.dataType.name == "dt_humidity_pct") {
      $div.innerHTML = element.value + "% Humidity";
      $div.setAttribute('class', 'block humidity');
    }
    else {
      $div.innerHTML = element.value + "ppm CO2";
      $div.setAttribute('class', 'block co2');
    }

    $container.appendChild($div);
  });

}



async function fetchData(type, params) {
  try {
    const response = await axios.get(`${config.api}/${type}`, { params });
    if (!(response && response.data && response.data.length > 0)) {
      throw { message: 'no data' };
    }
    return response.data;
  } catch (e) {
    console.error('error', e);
    return null;
  }
}

async function selectedSensor() {
  const x = document.getElementById("devices").selectedIndex;
  const y = document.getElementById("devices").options;
  const device = y[x].text;

  document.getElementById("sensorname").innerHTML = "Sensor: " + device;
  const data = await fetchData('measurements', { device })
  createDevicesHtml(data);
}



(async function () {
  const devices = await fetchData('devices');

  for (const device of devices) {
    createOption(device.guid);
  }
})();