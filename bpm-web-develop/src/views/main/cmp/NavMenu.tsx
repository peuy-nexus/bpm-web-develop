import { Component, Prop, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import menuRoutes from "@/router/menu-routers";

@Component({
    name: "NavMenu",
})
export default class RouteMenu extends Vue {
    @Prop({ type: Boolean, default: false }) collapse: boolean;

    @State("permissions") permissions: string[];

    $refs: any;

    // 获得聚焦菜单
    get activeMenu() {
        return this.$route.meta?.parent || this.$route.name;
    }

    handleMenuItemClick(e: any) {
        this.$router.push({
            name: e.name,
            query: {
                timestamp: `${new Date().getTime()}`,
            },
        });
    }

    render(h: any) {
        const menuItems: any[] = this.renderChild(menuRoutes);
        return (
            <el-menu
                default-active={this.activeMenu}
                collapse={this.collapse}
                background-color={"#2E313D"}
                text-color={"#FFFFFF"}
                style={"padding-bottom: 72px"}
                class={"nav-menu"}
            >
                {menuItems}
            </el-menu>
        );
    }

    renderChild(items: any[]): any[] {
        if (!items) {
            return [];
        }
        return items
            .map(item => {
                const meta = item.meta || {};
                if (!meta.menu) {
                    return;
                } else if (meta.permission && !this.hasPermission(meta.permission)) {
                    return;
                }
                if (item.children && item.children) {
                    const subItems: any[] = this.renderChild(item.children);
                    if (subItems.length === 0) {
                        return;
                    }
                    return (
                        <el-submenu index={item.name}>
                            <template slot="title">
                                {meta.icon && <i class={["iconfont", meta.icon]} />}
                                <span slot="title">{this.$t(meta.title)}</span>
                            </template>
                            {subItems}
                        </el-submenu>
                    );
                }

                return (
                    <el-menu-item index={item.name} onclick={this.handleMenuItemClick.bind(this, item)}>
                        {meta.icon && <i class={["iconfont", meta.icon]} />}
                        <span slot="title">{this.$t(meta.title)}</span>
                    </el-menu-item>
                );
            })
            .filter(item => !!item);
    }
}
