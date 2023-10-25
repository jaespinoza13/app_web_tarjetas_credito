import { useEffect } from 'react';
import { IsNullOrWhiteSpace } from '../js/utiles';

export function useExternalScripts({ url, link }) {
    useEffect(() => {
        const head = document.querySelector("head");
        const script = document.createElement("script");
        const linkTag = document.createElement("link");
        if (!IsNullOrWhiteSpace(url)) {
            script.setAttribute("src", url);
            head.appendChild(script);
        }
        if (!IsNullOrWhiteSpace(link)) {
            linkTag.setAttribute("href", link);
            linkTag.setAttribute("rel", "stylesheet");
            linkTag.setAttribute("type", "text/css");
            head.appendChild(linkTag);
        }
        return () => {
            if (!IsNullOrWhiteSpace(url)) {
                head.removeChild(script);
            }
            if (!IsNullOrWhiteSpace(link)) {
                head.removeChild(linkTag);
            }
        };
    }, [url, link]);
};

export function useExecuteScript({ execute }) {
    useEffect(() => {
        const element = document.getElementById("rootScript");
        const script = document.createElement("script");
        script.innerHTML = execute;
        element.appendChild(script);
        return () => {
            element.removeChild(script);
        };
    }, [execute]);
};