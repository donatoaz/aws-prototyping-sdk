/*! Copyright [Amazon.com](http://amazon.com/), Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0 */
import {
  BreadcrumbGroup,
  BreadcrumbGroupProps,
  SideNavigation,
  SideNavigationProps,
} from '@cloudscape-design/components';
import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import { CancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { createContext, useCallback, useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Auth from './Auth';
import Config from './config.json';
import Home from './Home';
import NavHeader from './NavHeader';

/**
 * Define your nav items here.
 */
const NAVIGATION_ITEMS: SideNavigationProps.Item[] = [
  { text: 'home', type: 'link', href: '/' },
];

/**
 * Context for updating/retrieving the AppLayout.
 */
export const AppLayoutContext = createContext({
  appLayoutProps: {},
  setAppLayoutProps: (_: AppLayoutProps) => {},
});

/**
 * Defines the App layout and contains logic for routing.
 */
const App: React.FC = () => {
  const navigate = useNavigate();
  const [activeHref, setActiveHref] = useState('/');
  const [activeBreadcrumbs, setActiveBreadcrumbs] = useState<BreadcrumbGroupProps.Item[]>([{ text: '/', href: '/' }]);
  const [appLayoutProps, setAppLayoutProps] = useState<AppLayoutProps>({});

  const setAppLayoutPropsSafe = useCallback((props: AppLayoutProps) => {
    JSON.stringify(appLayoutProps) !== JSON.stringify(props) && setAppLayoutProps(props);
  }, [appLayoutProps]);

  const onNavigate = useMemo((): CancelableEventHandler<BreadcrumbGroupProps.ClickDetail | SideNavigationProps.FollowDetail> => (e) => {
    e.preventDefault();
    setAppLayoutProps({});
    setActiveHref(e.detail.href);

    const segments = ['/', ...e.detail.href.split('/').filter(segment => segment !== '')];
    setActiveBreadcrumbs(segments
      .map((segment, i) => {
        const href = segments.slice(0, i+1).join('/').replace('//', '/');
        return {
          href,
          text: segment,
        };
      }),
    );
    navigate(e.detail.href);
  }, [navigate, setAppLayoutProps, setActiveBreadcrumbs]);

  return (
    <Auth>
      <NavHeader/>
      <AppLayout
        breadcrumbs={<BreadcrumbGroup
          onFollow={onNavigate}
          items={activeBreadcrumbs}/>}
        toolsHide
        navigation={
          <SideNavigation
            header={{ text: Config.applicationName, href: '/' }}
            activeHref={activeHref}
            onFollow={onNavigate}
            items={NAVIGATION_ITEMS}
          />}
        content={
          <AppLayoutContext.Provider value={{ appLayoutProps, setAppLayoutProps: setAppLayoutPropsSafe }}>
            <Routes>
              { /* Define all your routes here */ }
              <Route path="/" element={<Home/>}/>
            </Routes>
          </AppLayoutContext.Provider>
        }
        {...appLayoutProps}
      />
    </Auth>
  );
};

export default App;