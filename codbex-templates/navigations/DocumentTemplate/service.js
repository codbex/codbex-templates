const navigationData = {
    id: 'document-template-navigation',
    label: "Templates",
    group: "configurations",
    order: 800,
    link: "/services/web/codbex-templates/gen/codbex-templates/ui/Templates/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
