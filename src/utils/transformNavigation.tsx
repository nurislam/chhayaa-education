import DynamicIcon from "@/components/ui/dynamic-icon";
import { useAllModulePermissions } from "@/data/permissions/use-permissions.query";
import { type NavigationPageItem } from "@toolpad/core/AppProvider";
import { getAuthCredentials } from "./auth-utils";

interface Module {
  id: number;
  slug: string;
  name: string;
  icon: string;
  parentId: number | null;
  createdAt: string;
  createdBy: string;
  deleted: boolean;
  ordering: number;
  status: number;
  children?: Module[];
}

interface Permission {
  id: number;
  moduleId: number;
  groupId: number;
  actions: string[];
}

export function transformNavigation(modules: Module[]): NavigationPageItem[] {
  const authCredentials = getAuthCredentials();
  const groupId: number = authCredentials?.groupId ?? 0;

  const allModuleIds = modules?.map((item: any) => item.id) ?? [];
  const permissions = useAllModulePermissions(allModuleIds, groupId);

  if (!modules || !permissions) return [];

  const permittedModuleIds = new Set(permissions.map((p: Permission) => p.moduleId));

  const permittedModules: Module[] = modules.filter((mod) => permittedModuleIds.has(mod.id));

  if (!permittedModules.length) return [];

  return permittedModules.map((mod) => {
    const transformedItem: NavigationPageItem = {
      kind: "page",
      segment: mod.slug,
      title: mod.name.charAt(0).toUpperCase() + mod.name.slice(1),
      icon: <DynamicIcon iconName={mod.icon} size={20} />,
    };

    if (mod.children?.length) {
      transformedItem.children = mod.children.map((child) => ({
        kind: "page",
        segment: `${child.slug}`,
        title: `${child.name.charAt(0).toUpperCase() + child.name.slice(1)}`,
        icon: <DynamicIcon iconName={child.icon} size={20} />,
      }));
    }

    return transformedItem;
  });
}
