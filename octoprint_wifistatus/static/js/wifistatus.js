$(function () {
  function WiFiStatusViewModel(parameters) {
    var self = this;

    self.settingsViewModel = parameters[0];

    self._svgPrefix = '<path d="M0 0h24v24H0z" fill="none"/>';
    self._iconSVGs = [
      '<path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M4.79 12.52l7.2 8.98H12l.01-.01 7.2-8.98C18.85 12.24 16.1 10 12 10s-6.85 2.24-7.21 2.52z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/>',
    ];

    self.IconSVG = ko.observable(self._svgPrefix + self._iconSVGs[0]);
    self.wifiData = ko.observableArray([]);

    self.onDataUpdaterPluginMessage = function (plugin, data) {
      if (plugin != "wifistatus") {
        return;
      }

      svg = self._svgPrefix;

      var wfData;
      if (!data.interface) {
        svg += self._iconSVGs[0];
        wfData = [{ text: "No connection" }];
      } else {
        quality = Math.round((data.qual / data.qual_max) * 100);
        if (quality > 80) svg += self._iconSVGs[1];
        else if (quality > 60) svg += self._iconSVGs[2];
        else if (quality > 40) svg += self._iconSVGs[3];
        else if (quality > 20) svg += self._iconSVGs[4];
        else svg += self._iconSVGs[5];

        wfData = [
          { text: "Interface: " + data.interface },
          { text: "ESSID: " + data.essid },
          {
            text:
              "Quality: " +
              data.qual +
              "/" +
              data.qual_max +
              " (" +
              quality +
              "%)",
          },
          { text: "Bitrate: " + data.bitrate },
          { text: "Signal: " + data.signal + "dBm" },
        ];
        if (data.noise != 0)
          wfData.push({ text: "Noise: " + data.noise + "dBm" });
        if (data.frequency)
          wfData.push({ text: "Frequency: " + data.frequency });
        if (data.bssid) wfData.push({ text: "BSSID: " + data.bssid });
        if (data.ipv4addrs) {
          var i;
          for (i = 0; i < data.ipv4addrs.length; i++)
            wfData.push({
              text:
                (i == 0 ? "IPV4: " : "&nbsp;".repeat(10)) + data.ipv4addrs[i],
            });
        }
        if (data.ipv6addrs) {
          var i;
          for (i = 0; i < data.ipv6addrs.length; i++)
            wfData.push({
              text:
                (i == 0 ? "IPV6: " : "&nbsp;".repeat(10)) + data.ipv6addrs[i],
            });
        }
      }
      self.IconSVG(svg);
      self.wifiData(wfData);
      var navbarHeight = document.getElementById("navbar_systemmenu")
        .offsetHeight;
      var iconHeight = document
        .getElementById("navbar_plugin_wifistatus_icon")
        .getClientRects()[0].height;
      var link = document.getElementById("navbar_plugin_wifistatus_link");
      link.style.height = navbarHeight + "px";
      var topPadding = ((navbarHeight - iconHeight) / 2).toFixed();
      if (topPadding >= 0) {
        link.style.paddingTop = topPadding + "px";
      }
    };
  }

  OCTOPRINT_VIEWMODELS.push({
    construct: WiFiStatusViewModel,
    dependencies: ["settingsViewModel"],
    elements: ["#navbar_plugin_wifistatus"],
  });
});
