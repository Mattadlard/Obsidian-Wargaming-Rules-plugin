export function createIconElement(iconClass: string): HTMLElement {
    const iconElement = document.createElement('i');
    iconElement.className = iconClass;
    return iconElement;
}
