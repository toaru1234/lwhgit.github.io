var imageData = 0;
var imageUploadArea = $("#imageUploadArea");
var imageViewer = $("#imageViewer");
var resultArea = $("#resultArea");
var resultViewer = $("#resultViewer");
var doItBtn = $("#doItBtn");
var sensivity = 400;
var block = 100;

imageUploadArea.on({
    "drop": function(event) {
      var file = event.originalEvent.dataTransfer.files[0];
      var reader = new FileReader();
      $(reader).on("load", function() {
        var image = new Image();
        image.onload = function() {
          var canvas = document.createElement('canvas');
          var canvasContext = canvas.getContext("2d");

          if (this.width >= this.height) {
            width = 600;
            height = this.height / this.width * 600
            canvas.width = 600;
            canvas.height = height;
            canvasContext.drawImage(this, 0, 0, 600, height);
          }else if (this.width < this.height) {
            height = 600
            width = this.width / this.height * 600
            canvas.width = width;
            canvas.height = 600;
            canvasContext.drawImage(this, 0, 0, width, 600);
          }
          imageUploadArea.css("width", canvas.width + "px");
          imageUploadArea.css("height", canvas.height + "px");

          resultArea.css("width", canvas.width + "px");
          resultArea.css("height", canvas.height + "px");

          var dataURI = canvas.toDataURL("image/jpeg");

          imageViewer.attr("src", dataURI);
          imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);

          imageData = imageData;
        };
        image.src = reader.result;
      });
      reader.readAsDataURL(file);
      event.preventDefault()
    },
    "dragover": function(event) {
      event.preventDefault()
    }
});

doItBtn.on("click", function(event) {
  doIt(imageData);
});

function doIt(data) {
  var width = data.width;
  var height = data.height;
  block = height;

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var canvasContext = canvas.getContext("2d");

  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(0, 0, width, height);
  resultViewer.attr("src", canvas.toDataURL("image/jpeg"));

  var canvasData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);

  var x = 0;
  var y = 0;
  var interval = setInterval(function () {
    if (canvasData) {
      for (var i = y;i < y + block;i ++) {
        var org = data.data[(x + i * width) * 4] + data.data[(x + i * width) * 4 + 1] + data.data[(x + i * width) * 4 + 2];
        var r = rand(org * 100 / sensivity);
        if (r) {
          canvasData.data[(x + i * width) * 4] = 0;
          canvasData.data[(x + i * width) * 4 + 1] = 0;
          canvasData.data[(x + i * width) * 4 + 2] = 0;
        }
      }
      canvasContext.putImageData(canvasData, 0, 0);
      resultViewer.attr("src", canvas.toDataURL("image/jpeg"));
      x ++;
      if (x >= width) {
        x = 0;
        y += block;
      }

      if (y >= height && x >= width) {
        clearInterval(interval);
      }
    }
  }, 1);
}

function rand(per) {
  return Math.random() * 100 > per ? true : false;
}
