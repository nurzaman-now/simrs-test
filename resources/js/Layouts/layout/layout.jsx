/* eslint-disable react-hooks/exhaustive-deps */
import {useEventListener, useMountEffect, useUnmountEffect,} from "primereact/hooks";
import React, {useContext, useEffect, useRef} from "react";
import {classNames} from "primereact/utils";
import AppFooter from "@/Layouts/layout/AppFooter.jsx";
import AppSidebar from "@/Layouts/layout/AppSidebar.jsx";
import AppTopbar from "@/Layouts/layout/AppTopbar.jsx";
import AppConfig from "@/Layouts/layout/AppConfig.jsx";
import {LayoutContext} from "./context/layoutcontext";
import {PrimeReactContext} from "primereact/api";
import {Card} from "primereact/card";
// import { usePathname, useSearchParams } from "next/navigation";

const Layout = ({user, children}) => {
    const {layoutConfig, layoutState, setLayoutState} = useContext(LayoutContext);
    const {setRipple} = useContext(PrimeReactContext);
    const topbarRef = useRef(null);
    const sidebarRef = useRef(null);

    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
        useEventListener({
            type: "click",
            listener: (event) => {
                const isOutsideClicked = !(
                    sidebarRef.current?.isSameNode(event.target) ||
                    sidebarRef.current?.contains(event.target) ||
                    topbarRef.current?.menubutton?.isSameNode(event.target) ||
                    topbarRef.current?.menubutton?.contains(event.target)
                );

                if (isOutsideClicked) {
                    hideMenu();
                }
            },
        });

    const pathname = route().current();
    // const searchParams = useSearchParams();
    useEffect(() => {
        hideMenu();
        hideProfileMenu();
    }, [pathname]);

    const [
        bindProfileMenuOutsideClickListener,
        unbindProfileMenuOutsideClickListener,
    ] = useEventListener({
        type: "click",
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current?.topbarmenu?.isSameNode(event.target) ||
                topbarRef.current?.topbarmenu?.contains(event.target) ||
                topbarRef.current?.topbarmenubutton?.isSameNode(event.target) ||
                topbarRef.current?.topbarmenubutton?.contains(event.target)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        },
    });

    const hideMenu = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false,
        }));
        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    };

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            profileSidebarVisible: false,
        }));
        unbindProfileMenuOutsideClickListener();
    };

    const blockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.add("blocked-scroll");
        } else {
            document.body.className += " blocked-scroll";
        }
    };

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove("blocked-scroll");
        } else {
            document.body.className = document.body.className.replace(
                new RegExp(
                    "(^|\\b)" + "blocked-scroll".split(" ").join("|") + "(\\b|$)",
                    "gi"
                ),
                " "
            );
        }
    };

    useMountEffect(() => {
        setRipple(layoutConfig.ripple);
    });

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [layoutState.profileSidebarVisible]);

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
    });

    const containerClass = classNames("layout-wrapper", {
        "layout-overlay": layoutConfig.menuMode === "overlay",
        "layout-static": layoutConfig.menuMode === "static",
        "layout-static-inactive":
            layoutState.staticMenuDesktopInactive &&
            layoutConfig.menuMode === "static",
        "layout-overlay-active": layoutState.overlayMenuActive,
        "layout-mobile-active": layoutState.staticMenuMobileActive,
        "p-input-filled": layoutConfig.inputStyle === "filled",
        "p-ripple-disabled": !layoutConfig.ripple,
    });

    return (
        <React.Fragment>
            <div className={containerClass}>
                <AppTopbar ref={topbarRef}/>
                <div ref={sidebarRef} className="layout-sidebar flex flex-column justify-content-between">
                    <AppSidebar user={user}/>
                    <Card pt={{
                        content: {
                            className: 'p-0'
                        }
                    }}>
                        <div className="flex gap-2 align-items-center justify-content-center">
                            <h6 className="m-0">@</h6>
                            <h6 className="m-0">
                                {user.nama}
                                <br/>
                                {user.email}
                            </h6>
                        </div>
                    </Card>
                </div>
                <div className="layout-main-container">
                    <div className="layout-main">{children}</div>
                    <AppFooter/>
                </div>
                <AppConfig/>
                <div className="layout-mask"></div>
            </div>
        </React.Fragment>
    );
};

export default Layout;
