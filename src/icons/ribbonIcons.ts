export function createRibbonIcon(iconClass: string) {
    const iconElement = document.createElement('i');
    iconElement.className = iconClass;
    return iconElement;
}
