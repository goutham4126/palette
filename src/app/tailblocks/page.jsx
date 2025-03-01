"use client"
import React, { useState, useEffect, useRef } from 'react';
import Frame from 'react-frame-component';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import getIcons from '../icons';
import getBlock from '../blocks';

const iconList = getIcons();
const blockListArr = [];

Object.entries(iconList).forEach(([type, icons]) => {
  Object.keys(icons).map(name => blockListArr.push(`${name},${type}`));
});

const themeList = ["indigo", "red", "pink", "blue", "green", "yellow"];

const desktopIcon = (
  <svg
    stroke="currentColor"
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x={2} y={3} width={20} height={14} rx={2} ry={2} />
    <path d="M8 21h8m-4-4v4" />
  </svg>
);

const phoneIcon = (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x={5} y={2} width={14} height={20} rx={2} ry={2} />
    <path d="M12 18h.01" />
  </svg>
);

const tabletIcon = (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x={4} y={2} width={16} height={20} rx={2} ry={2} />
    <path d="M12 18h.01" />
  </svg>
);

const clipboardIcon = (
  <svg
    viewBox="0 0 25 24"
    stroke="currentColor"
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19.914 1h-18v19" />
    <path d="M6 5v18h18V5z" />
  </svg>
);

const viewList = [
  {
    icon: desktopIcon,
    name: 'desktop'
  },
  {
    icon: tabletIcon,
    name: 'tablet'
  },
  {
    icon: phoneIcon,
    name: 'phone'
  }
];

const TailBlocks = () => {
  const [ready, setReady] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [codeView, setCodeView] = useState(false);
  const [currentKeyCode, setCurrentKeyCode] = useState(null);
  const [view, setView] = useState('desktop');
  const [theme, setTheme] = useState('indigo');
  const [blockType, setBlockType] = useState('Blog');
  const [blockName, setBlockName] = useState('BlogA');
  const [markup, setMarkup] = useState('');

  const markupRef = useRef(null);
  const textareaRef = useRef(null);
  const sidebarRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    document.addEventListener('keydown', keyboardNavigation);
    return () => {
      document.removeEventListener('keydown', keyboardNavigation);
    };
  }, []);

  const keyboardNavigation = (e) => {
    const blockStringFormat = `${blockName},${blockType}`;
    const keyCode = e.which || e.keyCode;

    switch (keyCode) {
      case 40: // Down
        e.preventDefault();
        blockListArr.forEach((block, index) => {
          if (block === blockStringFormat) {
            const newActiveBlock = index + 1 <= blockListArr.length - 1 ? blockListArr[index + 1].split(',') : blockListArr[0].split(',');
            const newBlockName = newActiveBlock[0];
            const newBlockType = newActiveBlock[1];
            const newBlockNode = document.querySelector(`.block-item[block-name="${newBlockName}"]`);
            if (newBlockNode) newBlockNode.focus();
            setBlockType(newBlockType);
            setBlockName(newBlockName);
            setCodeView(false);
            setCurrentKeyCode(40);
          }
        });
        break;
      case 37: // Left
        e.preventDefault();
        setSidebar(false);
        setCurrentKeyCode(37);
        break;
      case 39: // Right
        e.preventDefault();
        setSidebar(true);
        setCurrentKeyCode(39);
        break;
      case 38: // Up
        e.preventDefault();
        blockListArr.forEach((block, index) => {
          if (block === blockStringFormat) {
            const newActiveBlock = index - 1 >= 0 ? blockListArr[index - 1].split(',') : blockListArr[blockListArr.length - 1].split(',');
            const newBlockName = newActiveBlock[0];
            const newBlockType = newActiveBlock[1];
            const newBlockNode = document.querySelector(`.block-item[block-name="${newBlockName}"]`);
            if (newBlockNode) newBlockNode.focus();

            setBlockType(newBlockType);
            setBlockName(newBlockName);
            setCodeView(false);
            setCurrentKeyCode(38);
          }
        });
        break;
      default:
        return;
    }

    setTimeout(() => {
      if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
        setCurrentKeyCode(null);
      }
    }, 200);
  };

  const changeMode = () => {
    setDarkMode(!darkMode);
  };

  const handleContentDidMount = () => {
    const iframe = document.querySelector('iframe');
    iframe.contentWindow.document.addEventListener('keydown', keyboardNavigation);
    iframe.contentWindow.document.addEventListener('click', () => setSidebar(false));

    setTimeout(() => {
      setReady(true);
      setMarkup(markupRef.current.innerHTML);
    }, 400);
  };

  const beautifyHTML = (codeStr) => {
    const process = (str) => {
      let div = document.createElement('div');
      div.innerHTML = str.trim();
      return format(div, 0).innerHTML.trim();
    };

    const format = (node, level) => {
      let indentBefore = new Array(level++ + 1).join('  '),
        indentAfter = new Array(level - 1).join('  '),
        textNode;

      for (let i = 0; i < node.children.length; i++) {
        textNode = document.createTextNode('\n' + indentBefore);
        node.insertBefore(textNode, node.children[i]);

        format(node.children[i], level);

        if (node.lastElementChild === node.children[i]) {
          textNode = document.createTextNode('\n' + indentAfter);
          node.appendChild(textNode);
        }
      }

      return node;
    };
    return process(codeStr);
  };

  const changeBlock = (e) => {
    const { currentTarget } = e;
    const blockType = currentTarget.getAttribute('block-type');
    const blockName = currentTarget.getAttribute('block-name');
    setBlockType(blockType);
    setBlockName(blockName);
    setCodeView(false);
  };

  const changeTheme = (e) => {
    const { currentTarget } = e;
    const theme = currentTarget.getAttribute('data-theme');
    setTheme(theme);
  };

  const changeView = (e) => {
    const { currentTarget } = e;
    const view = currentTarget.getAttribute('data-view');
    setView(view);
    setCodeView(false);
  };

  const toggleView = () => {
    setCodeView(!codeView);
    setView('desktop');
    setMarkup(markupRef.current.innerHTML);
  };

  const themeClasses = {
    indigo: 'bg-indigo-500',
    red: 'bg-red-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };
  
  const themeListRenderer = () => {
    return themeList.map((t, k) => (
      <button
        key={k}
        data-theme={t}
        onKeyDown={keyboardNavigation}
        className={`theme-button ${themeClasses[t]}${theme === t ? ' is-active' : ''}`}
        onClick={changeTheme}
      ></button>
    ));
  };

  const listRenderer = () => {
    return Object.entries(iconList).map(([type, icons]) =>
      <div className="blocks" key={type}>
        <div className="block-category">{type}</div>
        <div className="block-list">
          {Object.entries(icons).map(icon => <button key={icon[0]} tabIndex="0" onClick={changeBlock} className={`block-item${icon[0] === blockName ? ' is-active' : ''}`} block-type={type} block-name={icon[0]}>{icon[1]}</button>)}
        </div>
      </div>
    );
  };

  const viewModeRenderer = () => {
    return viewList.map((v, k) => <button key={k} className={`device${view === v.name ? ' is-active' : ''}`} data-view={v.name} onClick={changeView}>{v.icon}</button>);
  };

  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  const copyToClipboard = () => {
    const code = beautifyHTML(markup);
    var input = document.createElement('textarea');
    input.innerHTML = code;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`app${darkMode ? ' dark-mode' : ''}${sidebar ? ' has-sidebar' : ''} ${theme} ${view}`}>
      <textarea className="copy-textarea" ref={textareaRef} />
      <aside className="sidebar" ref={sidebarRef}>
        {listRenderer()}
      </aside>
      <div className="toolbar">
        <button className="opener" onClick={toggleSidebar} ref={openerRef}></button>
        {codeView &&
          <div className="clipboard-wrapper">
            <button className="copy-the-block copy-to-clipboard" onClick={copyToClipboard}>
              {clipboardIcon}
              <span>COPY TO CLIPBOARD</span>
            </button>
            <span className={`clipboard-tooltip${copied ? ' is-copied ' : ''}`} >Copied!</span>
          </div>
        }
        <button className="copy-the-block" onClick={toggleView}>
          {!codeView ?
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 18L22 12 16 6"></path>
              <path d="M8 6L2 12 8 18"></path>
            </svg>
            :
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="css-i6dzq1"
              viewBox="0 0 24 24"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          }
          <span>{!codeView ? 'VIEW CODE' : 'PREVIEW'}</span>
        </button>
        <div className="switcher">
          {themeListRenderer()}
        </div>
        {viewModeRenderer()}
        <button className="mode" onClick={changeMode}></button>
      </div>
      <div className="markup" ref={markupRef}>{getBlock({ theme, darkMode })[blockType][blockName]}</div>
      <main className="main" style={{ opacity: ready ? '1' : '0' }}>
        <div className={`view${codeView ? ' show-code' : ''}`}>
          <Frame
            contentDidMount={handleContentDidMount}
            contentDidUpdate={handleContentDidMount}
            head={
              <>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.2/tailwind.min.css" rel="stylesheet" />
                {
                  <style dangerouslySetInnerHTML={{ __html:
                    `img { filter:
                      ${darkMode ?
                        'invert(1) opacity(.5); mix-blend-mode: luminosity; }'
                        :
                        'sepia(1) hue-rotate(190deg) opacity(.46) grayscale(.7) }'
                      }`
                    }}
                  />
                }
              </>
            }
          >
            {getBlock({ theme, darkMode })[blockType][blockName]}
          </Frame>
          <div className="codes">
            <SyntaxHighlighter language="html" style={darkMode ? vs2015 : docco} showLineNumbers>
              {beautifyHTML(markup)}
            </SyntaxHighlighter>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TailBlocks;