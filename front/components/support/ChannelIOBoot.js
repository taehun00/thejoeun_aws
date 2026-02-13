//ChannelIOBoot
import { useEffect } from "react";

export default function ChannelIOBoot() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 이미 있으면 재사용
    if (!window.ChannelIO) {
      (function () {
        var w = window;
        var ch = function () {
          ch.c(arguments);
        };
        ch.q = [];
        ch.c = function (args) {
          ch.q.push(args);
        };
        w.ChannelIO = ch;

        function l() {
          if (w.ChannelIOInitialized) return;
          w.ChannelIOInitialized = true;

          var s = document.createElement("script");
          s.type = "text/javascript";
          s.async = true;
          s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
          var x = document.getElementsByTagName("script")[0];
          if (x.parentNode) x.parentNode.insertBefore(s, x);
        }

        l();
      })();
    }

    // boot (반드시 1회)
    window.ChannelIO("boot", {
      pluginKey: "afb5a7b9-9200-440f-999a-7f0ef91db208",
    });
  }, []);

  return null;
}
