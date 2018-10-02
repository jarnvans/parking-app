const getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

function renewParkingStates() {
    getJSON("https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json", function(error, data){
        let oldParkingState = [];
        let newParkingState = [];
        let parkingsEl = document.querySelector('.parkings');
        let parkingStateChange = "";
        let tempStr = "";
        let almostFull = "";

        if (data != null && data != undefined && data.length > 0){
            data.sort(function(a, b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            })
        }

        console.log(localStorage.getItem('parkingStates'));
        if (localStorage.getItem('parkingStates') != null) {
            oldParkingState = localStorage.getItem('parkingStates').split(',');
            console.log(oldParkingState);
        }

        

        for(let i = 0; i < data.length; i++){
            let col = "";
            if (data[i].parkingStatus.availableCapacity < 10){
                almostFull = '<p class="almost-full">Parking is bijna vol</p>';
            }
            if (data[i].parkingStatus.availableCapacity / data[i].parkingStatus.totalCapacity < 0.2) {
                col = "red";
            }
            else if (data[i].parkingStatus.availableCapacity / data[i].parkingStatus.totalCapacity >= 0.2 && data[i].parkingStatus.availableCapacity / data[i].parkingStatus.totalCapacity <= 0.5){
                col = "orange";
            }
            else {
                col = "green";
            }

            if(localStorage.getItem('parkingStates') != null) {
                if (oldParkingState[i] < data[i].parkingStatus.availableCapacity) {
                    parkingStateChange = '<i class="change fas fa-arrow-up"></i>';
                }
                else if (oldParkingState[i] > data[i].parkingStatus.availableCapacity) {
                    parkingStateChange = '<i class="change fas fa-arrow-down"></i>'
                }
                else {
                    parkingStateChange = '<i class="change fas fa-equals"></i>'
                }
            }
             

            tempStr += `
                <div class="parking parking${i+1} ${col}">
                    <h1 class="parking-name">${data[i].name}</h1>
                    <div class="parking-capacity">
                        ${almostFull}
                        <p class="">${data[i].parkingStatus.availableCapacity} / ${data[i].parkingStatus.totalCapacity}</p>${parkingStateChange}
                    </div>
                </div>
            `
            

            newParkingState.push(data[i].parkingStatus.availableCapacity);
        }
        localStorage.setItem('parkingStates', newParkingState.toString());
        parkingsEl.innerHTML = tempStr;

        
        
        console.log("vernieuwd");
        
    })
}



setInterval(renewParkingStates, 5000);