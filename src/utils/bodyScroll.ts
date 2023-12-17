let scrollBarWidth: number;

const getScrollBarWidth = () => {
    if (scrollBarWidth === undefined) {
        const el = document.createElement("div");
        el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
        document.body.appendChild(el);
        scrollBarWidth = el.offsetWidth - el.clientWidth;
        el.remove();
    }
    return scrollBarWidth;
}

export const blockBodyScroll = () => {
    const { overflow, paddingRight } = window.document.body.style;

    window.document.body.style.overflow = 'hidden';
    // Needs to prevent body width bouncing because of scrollbar removing
    window.document.body.style.paddingRight = `${getScrollBarWidth()}px`;

    return { overflow, paddingRight };
}

export const restoreBodyScroll = (styles?: { overflow?: string, paddingRight?: string }) => {
    window.document.body.style.overflow = styles?.overflow || '';
    window.document.body.style.paddingRight = styles?.paddingRight || '';
}