import { h, defineComponent } from "vue";
import { Icon as IconifyIcon, addIcon } from "@iconify/vue/dist/offline";

// element-plus icon
import Check from "@iconify-icons/ep/check";
import Menu from "@iconify-icons/ep/menu";
import HomeFilled from "@iconify-icons/ep/home-filled";
import SetUp from "@iconify-icons/ep/set-up";
import Edit from "@iconify-icons/ep/edit";
import Setting from "@iconify-icons/ep/setting";
import Lollipop from "@iconify-icons/ep/lollipop";
import Link from "@iconify-icons/ep/link";
import Position from "@iconify-icons/ep/position";
import Histogram from "@iconify-icons/ep/histogram";
import RefreshRight from "@iconify-icons/ep/refresh-right";
import ArrowDown from "@iconify-icons/ep/arrow-down";
import Close from "@iconify-icons/ep/close";
import CloseBold from "@iconify-icons/ep/close-bold";
import Bell from "@iconify-icons/ep/bell";
import Guide from "@iconify-icons/ep/guide";
import Iphone from "@iconify-icons/ep/iphone";
import Location from "@iconify-icons/ep/location";
import Tickets from "@iconify-icons/ep/tickets";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import Notebook from "@iconify-icons/ep/notebook";
import Rank from "@iconify-icons/ep/rank";
import VideoPlay from "@iconify-icons/ep/video-play";
import Monitor from "@iconify-icons/ep/monitor";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import More from "@iconify-icons/ep/more-filled";
addIcon("check", Check);
addIcon("menu", Menu);
addIcon("home-filled", HomeFilled);
addIcon("set-up", SetUp);
addIcon("edit", Edit);
addIcon("setting", Setting);
addIcon("lollipop", Lollipop);
addIcon("link", Link);
addIcon("position", Position);
addIcon("histogram", Histogram);
addIcon("refresh-right", RefreshRight);
addIcon("arrow-down", ArrowDown);
addIcon("close", Close);
addIcon("close-bold", CloseBold);
addIcon("bell", Bell);
addIcon("guide", Guide);
addIcon("iphone", Iphone);
addIcon("location", Location);
addIcon("tickets", Tickets);
addIcon("office-building", OfficeBuilding);
addIcon("notebook", Notebook);
addIcon("video-play", VideoPlay);
addIcon("rank", Rank);
addIcon("monitor", Monitor);
addIcon("search", Search);
addIcon("refresh", Refresh);
addIcon("edits", EditPen);
addIcon("delete", Delete);
addIcon("more", More);

// Iconify Icon在Vue里离线使用（用于内网环境）https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "IconifyIconOffline",
  components: { IconifyIcon },
  props: {
    icon: {
      type: String,
      default: "",
    },
  },
  render() {
    const attrs = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: `${this.icon}`,
        ...attrs,
      },
      {
        default: () => [],
      }
    );
  },
});
