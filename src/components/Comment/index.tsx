// source from https://www.alanwang.site/posts/blog-guides/docusaurus-comment
import React, { forwardRef, useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Giscus, { GiscusProps } from '@giscus/react';
import {
  useThemeConfig,
  useColorMode,
  ThemeConfig
} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface CustomThemeConfig extends ThemeConfig {
  giscus: GiscusProps & { darkTheme: string };
}

export const Comment = forwardRef<HTMLDivElement>((_props, ref) => {
  const {
    i18n: { currentLocale }
  } = useDocusaurusContext();
  const { giscus } = useThemeConfig() as CustomThemeConfig;
  const { colorMode } = useColorMode();
  const { theme = 'light', darkTheme = 'dark_dimmed' } = giscus;
  const giscusTheme = colorMode === 'dark' ? darkTheme : theme;
  const [routeDidUpdate, setRouteDidUpdate] = useState(false);

  useEffect(() => {
    function eventHandler(e) {
      setRouteDidUpdate(true);
    }

    window.emitter.on('onRouteDidUpdate', eventHandler);

    return () => {
      window.emitter.off('onRouteDidUpdate', eventHandler);
    };
  }, []);

  if (!routeDidUpdate) {
    return null;
  }

  return (
    <BrowserOnly fallback={<div>Loading Comments...</div>}>
      {() => (
        // https://giscus.app/zh-CN
        <div ref={ref} id="comment" style={{ paddingTop: 50 }}>
          <Giscus
            id="comments"
            mapping="pathname"
            strict="1"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            lang={currentLocale === 'zh' ? 'zh-CN' : currentLocale}
            loading="lazy"
            crossorigin="anonymous"
            {...giscus}
            theme={giscusTheme}
          />
        </div>
      )}
    </BrowserOnly>
  );
});

export default Comment;
