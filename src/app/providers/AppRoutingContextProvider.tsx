'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '@/../i18nConfig';
// import routes from '@/routes/routes';

type Props = {
  children: React.ReactNode;
  protectedRoutes: string[];
  communityProtectedRoutes: string[];
};
interface DynamicPathParams {
  [key: string]: string | number | boolean;
}

export type NavigateOptions = {
  options?: DynamicPathParams;
  defaultOptions?: DynamicPathParams;
  searchParams?: DynamicPathParams;
  doNothingIfCurrent?: boolean;
};
interface AppRoutingContextType {
  navigate: (pathTemplate: string, options?: NavigateOptions) => string | void;
  constructPath: (pathTemplate: string, options?: NavigateOptions) => string;
  pathMatchesTemplate: (pathTemplate: string, pathName: string) => boolean;
  isCurrentPath: (pathTemplate: string) => boolean;
  isRouteProtected: (pathname: string) => boolean;
  isRouteCommunityProtected: (pathname: string) => boolean;
}

const AppRoutingContext = createContext<AppRoutingContextType | null>(null);

// Provider Component
const AppRoutingProvider = ({
  children,
  protectedRoutes,
  communityProtectedRoutes,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { i18n } = useTranslation();
  const _currentPath = usePathname();
  const _currentLocale = i18n.language;
  const _defaultLocale = i18nConfig.defaultLocale; // Replace with your default locale

  // Normalize pathname to remove locale
  const _normalizePathname = (pathname: string) =>
    _currentLocale === _defaultLocale
      ? pathname
      : pathname.replace(`/${_currentLocale}`, '') || '/';

  // Check if a path matches a path template
  const pathMatchesTemplate = (
    pathTemplate: string,
    pathName: string,
  ): boolean => {
    const normalizedPath = _normalizePathname(pathName);
    // Split both paths into segments
    const pathSegments = normalizedPath.split('/').filter(Boolean);
    const templateSegments = pathTemplate.split('/').filter(Boolean);

    // Ensure they have the same number of segments
    if (pathSegments.length !== templateSegments.length) {
      return false;
    }

    // Compare each segment
    for (let i = 0; i < templateSegments.length; i++) {
      const isDynamicSegment = templateSegments[i].startsWith(':');
      if (!isDynamicSegment && pathSegments[i] !== templateSegments[i]) {
        return false;
      }
    }
    return true;
  };

  // Check if current path matches a given path
  const isCurrentPath = (pathTemplate: string): boolean => {
    return pathMatchesTemplate(pathTemplate, _currentPath);
  };

  /**
   * Navigate function
   * -> Navigate to a given pathTemplate,
   * and dynamically replace any placeholders with values from current paths / options
   * */
  const navigate = (
    pathTemplate: string, // this would work even this is the exact path
    {
      options = {},
      defaultOptions = {},
      doNothingIfCurrent = false,
      searchParams = {},
    } = {},
  ): string => {
    const newPath = constructPath(pathTemplate, {
      options,
      defaultOptions,
      // searchParams,
    }); // ignore the seach params for now

    // Perform the navigation
    if (doNothingIfCurrent && _currentPath === newPath) {
      return newPath;
    } else {
      // add back the search params
      console.log(`navigate from ${_currentPath} to ${newPath}`, searchParams);
      if (searchParams && Object.keys(searchParams).length > 0) {
        const param = new URLSearchParams(searchParams);
        router.push(newPath + '?' + param.toString());
      } else {
        router.push(newPath);
      }
      return newPath;
    }
  };

  const constructPath = (
    pathTemplate: string, // this would work even this is the exact path
    { options = {}, defaultOptions = {}, searchParams = {} } = {},
  ): string => {
    // ============== handle dynamic pathings ===================
    // Normalize the current path by removing the locale
    const normalizedCurrentPath = _normalizePathname(_currentPath);
    const pathSegments = normalizedCurrentPath.split('/').filter(Boolean);
    const templateSegments = pathTemplate.split('/').filter(Boolean);
    let dynamicValues: DynamicPathParams = {};

    // Extract dynamic values from the normalized current path
    templateSegments.forEach((segment, index) => {
      if (segment.startsWith(':') && pathSegments.length > index) {
        const key = segment.substring(1); // Remove the ':' prefix
        dynamicValues[key] = pathSegments[index];
      }
    });

    // Merge with options, allowing options to override
    // Note: defaultOptions are the lowest priority, then dynamicValues, then options
    dynamicValues = { ...defaultOptions, ...dynamicValues, ...options };

    // Construct the new path with the current locale
    let newPath = templateSegments
      .map((segment) => {
        if (segment.startsWith(':')) {
          const key = segment.substring(1);
          if (!dynamicValues[key]) {
            throw new Error(`Missing value for dynamic path segment ':${key}'`);
          }
          return dynamicValues[key];
        }
        return segment;
      })
      .join('/');

    // Include the locale in the path
    newPath =
      _currentLocale === _defaultLocale
        ? `/${newPath}`
        : `/${_currentLocale}/${newPath}`;

    // ============== add back searchParams if any ===================
    if (searchParams && Object.keys(searchParams).length > 0) {
      const param = new URLSearchParams(searchParams);
      newPath = newPath + '?' + param.toString();
    }

    return newPath;
  };

  // Check if a route is protected
  const isRouteProtected = (pathname: string): boolean => {
    // Check if the current pathname matches any of the protected route templates
    return protectedRoutes.some((protectedRouteTemplate) =>
      pathMatchesTemplate(protectedRouteTemplate, pathname),
    );
  };

  const isRouteCommunityProtected = (pathname: string): boolean => {
    // Check if the current pathname matches any of the protected route templates
    return communityProtectedRoutes.some((protectedRouteTemplate) =>
      pathMatchesTemplate(protectedRouteTemplate, pathname),
    );
  };

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      navigate,
      constructPath,
      pathMatchesTemplate,
      isCurrentPath,
      isRouteCommunityProtected,
      isRouteProtected,
    }),
    [navigate, isCurrentPath],
  );

  return (
    <AppRoutingContext.Provider value={contextValue}>
      {children}
    </AppRoutingContext.Provider>
  );
};

// Custom Hook for using AppRouting
export const useAppRouting = () => {
  const context = useContext(AppRoutingContext);
  if (!context) {
    throw new Error('useAppRouting must be used within an AppRoutingProvider');
  }
  return context;
};

export default AppRoutingProvider;
