(self.webpackChunkhongseungah_tech_blog=self.webpackChunkhongseungah_tech_blog||[]).push([[691],{7345:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return R}});var n=i(4160),r=i(7294),o=i(5086),l=i(4541),a=i(8032),s=i(5893);const d=(0,o.default)(n.rU).withConfig({displayName:"PostItem__PostItemWrapper",componentId:"sc-czv8xq-0"})(["display:flex;flex-direction:column;border-radius:10px;border:1px solid rgba(0,0,0,0.15);transition:0.3s box-shadow;cursor:pointer;@media (min-width:1024px){border:none;box-shadow:0 0 2px rgba(0,0,0,0.15);&:hover{box-shadow:0 0 10px rgba(0,0,0,0.3);}}"]),c=o.default.div.withConfig({displayName:"PostItem__PostItemContent",componentId:"sc-czv8xq-1"})(["display:flex;flex-direction:column;flex:1;padding:16px;word-break:break-word;"]),p=o.default.h3.withConfig({displayName:"PostItem__Title",componentId:"sc-czv8xq-2"})(["display:-webkit-box;overflow:hidden;margin-bottom:8px;text-overflow:ellipsis;white-space:normal;overflow-wrap:break-word;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:24px;font-weight:700;"]),f=o.default.p.withConfig({displayName:"PostItem__Date",componentId:"sc-czv8xq-3"})(["font-size:14px;font-weight:400;opacity:0.7;"]),m=o.default.div.withConfig({displayName:"PostItem__ThumbnailImageWrapper",componentId:"sc-czv8xq-4"})(["position:relative;width:100%;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #2d2d2d;&:before{display:block;padding-top:calc(9 / 16 * 100%);content:'';}@media (max-width:768px){display:none;}"]),h=(0,o.default)(a.G).withConfig({displayName:"PostItem__ThumbnailImage",componentId:"sc-czv8xq-5"})(["position:absolute;inset:0;width:100%;height:100%;border-radius:10px 10px 0 0;"]),u=o.default.p.withConfig({displayName:"PostItem__Summary",componentId:"sc-czv8xq-6"})(["margin-top:8px;font-weight:500;"]);var x=function(e){let{title:t,date:i,thumbnail:{childImageSharp:{gatsbyImageData:n}},excerpt:r,link:o}=e;return(0,s.jsxs)(d,{to:o,children:[(0,s.jsx)(m,{children:(0,s.jsx)(h,{image:n,alt:"Post Item Image",objectFit:"cover"})}),(0,s.jsxs)(c,{children:[(0,s.jsx)(p,{children:t}),(0,s.jsx)(f,{children:i}),(0,s.jsx)(u,{children:r})]})]})};var g=(e,t)=>{const i=(0,r.useRef)(null),{0:n,1:o}=(0,r.useState)(1);return(0,r.useEffect)((()=>{const r=new IntersectionObserver(((e,t)=>{e[0].isIntersecting&&(o((e=>e+1)),t.disconnect())}));if(!(t*n>=e.length||null===i.current))return r.observe(i.current),()=>{r.disconnect()}}),[n,e,i]),[i,e.slice(0,n*t)]};const v=o.default.div.withConfig({displayName:"PostList__PostListWrapper",componentId:"sc-15ngxzz-0"})(["display:grid;grid-template-columns:1fr 1fr 1fr 1fr;grid-gap:20px;padding-bottom:80px;@media (max-width:1200px){grid-template-columns:1fr 1fr 1fr;}@media (max-width:1024px){grid-template-columns:1fr 1fr;}@media (max-width:768px){grid-template-columns:1fr;}"]);var b=e=>{let{posts:t,INIT_PER_PAGE_NUMBER:i}=e;const[n,o]=g(t,i);return(0,s.jsxs)(v,{children:[o.map((e=>{let{node:{id:t,fields:{slug:i},frontmatter:n,excerpt:o}}=e;return(0,r.createElement)(x,{...n,excerpt:o,link:i,key:t})})),(0,s.jsx)("div",{ref:n})]})},w=i(5785);var C=()=>{const{0:e,1:t}=(0,r.useState)();return{ref:(0,r.useCallback)((e=>{e&&t(e)}),[]),handleScrollHorzCenter:(0,r.useCallback)((t=>{const i=t.target,{offsetWidth:n}=i;if(e&&e.contains(i)){const{scrollLeft:t,offsetWidth:r}=e,o=i.getBoundingClientRect().left+t-e.getBoundingClientRect().left-r/2+n/2;e.scroll({left:o,top:0,behavior:"smooth"})}}),[e])}};const y=o.default.li.withConfig({displayName:"PostFilterItem__PostItem",componentId:"sc-uqgeqd-0"})(["display:flex;align-items:center;margin:0.1em 12px 0.1em 0;padding:8px 12px;border-radius:15px;cursor:pointer;font-weight:700;background-color:",";border:",";color:",";"],(e=>e.$active?"#030303":"rgba(0, 0, 0, 0.05)"),(e=>e.$active?"1px solid #343a40":"1px solid rgba(0, 0, 0, 0.1)"),(e=>e.$active?"#ffffff":"1px solid rgba(0, 0, 0, 0.05)"));var _=e=>{let{active:t,handleFilterClick:i,scrollHorzCenter:n,children:r}=e;return(0,s.jsx)(y,{onClick:e=>{i(),n(e)},$active:t,children:r})};const I=o.default.section.withConfig({displayName:"PostHeadTagFilter__PostFilterContainer",componentId:"sc-1h3pawz-0"})(["margin-bottom:20px;padding:8px 0;border-radius:10px;border:1px solid rgba(0,0,0,0.15);"]),j=o.default.ul.withConfig({displayName:"PostHeadTagFilter__PostFilterList",componentId:"sc-1h3pawz-1"})(["display:flex;padding:0 4px;overflow-x:auto;list-style:none;"]);var k=e=>{let{posts:t,filter:i,handleFilter:n}=e;const{ref:o,handleScrollHorzCenter:l}=C(),a=(0,r.useMemo)((()=>{const e=t.reduce(((e,t)=>{let{node:{frontmatter:i}}=t;return[].concat((0,w.Z)(e),(0,w.Z)(i.tags))}),[]);return e.filter(((t,i)=>e.indexOf(t)===i))}),[t]);return(0,s.jsx)(I,{children:(0,s.jsx)(j,{ref:o,children:a.map(((e,t)=>(0,s.jsxs)("div",{children:[0===t&&(0,s.jsx)(_,{handleFilterClick:()=>n("tag","ALL"),active:"ALL"===i,scrollHorzCenter:l,children:"ALL"}),(0,s.jsx)(_,{handleFilterClick:()=>n("tag",e),active:i===e,scrollHorzCenter:l,children:e})]},"PostHeadTagFilterTags_"+t)))})})},L=i(450);const P=o.default.section.withConfig({displayName:"PostAsideFilter__PostFilterContainer",componentId:"sc-rmvlf7-0"})(["position:sticky;top:0;z-index:1;background-color:#ffffff;margin-left:16px;padding:8px 0;width:20%;height:calc(100vh);overflow:auto;& > h3{color:#888;margin-bottom:12px;}h3:nth-child(3){margin-top:32px;}"]),A=o.default.ul.withConfig({displayName:"PostAsideFilter__PostFilterList",componentId:"sc-rmvlf7-1"})(["display:flex;flex-wrap:wrap;list-style:none;"]);var z=e=>{let{type:t,posts:i,filter:n,handleFilter:o}=e;const{ref:l,handleScrollHorzCenter:a}=C(),{ref:d,handleScrollHorzCenter:c}=C(),p=(0,r.useMemo)((()=>i.filter(((e,t)=>{let{node:{frontmatter:n}}=e;return i.findIndex((e=>e.node.frontmatter.category===n.category))===t}))),[i]),f=(0,r.useMemo)((()=>{const e=i.reduce(((e,t)=>{let{node:{frontmatter:i}}=t;return[].concat((0,w.Z)(e),(0,w.Z)(i.tags))}),[]);return e.filter(((t,i)=>e.indexOf(t)===i))}),[i]);return(0,s.jsxs)(P,{children:[(0,s.jsx)("h3",{children:"카테고리"}),(0,s.jsx)(A,{ref:l,children:p.map(((e,i)=>(0,s.jsxs)("div",{children:[0===i&&(0,s.jsx)(_,{handleFilterClick:()=>o("CATEGORY","ALL"),active:"CATEGORY"===t&&"ALL"===n,scrollHorzCenter:a,children:"ALL"}),(0,s.jsx)(_,{handleFilterClick:()=>o("CATEGORY",e.node.frontmatter.category),active:"CATEGORY"===t&&n===e.node.frontmatter.category,scrollHorzCenter:a,children:e.node.frontmatter.category})]},"PostAsideFilterTagsCategory_"+i)))}),(0,s.jsx)("h3",{children:"태그"}),(0,s.jsx)(A,{ref:d,children:f.map(((e,i)=>(0,s.jsxs)("div",{children:[0===i&&(0,s.jsx)(_,{handleFilterClick:()=>o("TAGS","ALL"),active:"TAGS"===t&&"ALL"===n,scrollHorzCenter:c,children:"ALL"}),(0,s.jsx)(_,{handleFilterClick:()=>o("TAGS",e),active:"TAGS"===t&&n===e,scrollHorzCenter:c,children:e})]},"PostAsideFilterTagsAll_"+i)))})]})};const F=o.default.div.withConfig({displayName:"pages__PostWrapper",componentId:"sc-s6lv5q-0"})(["display:flex;margin-left:15%;margin-top:20px;padding:0 20px;@media (max-width:1024px){margin-left:0;margin-top:0;}"]),T=o.default.div.withConfig({displayName:"pages__PostContent",componentId:"sc-s6lv5q-1"})(["display:flex;flex-direction:column;width:100%;"]),E=o.default.a.withConfig({displayName:"pages__SocialLink",componentId:"sc-s6lv5q-2"})(["display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.7);color:#161b21;width:40px;height:40px;min-width:40px;font-size:20px;border:none;border-radius:50%;& > img{width:",";height:",";}"],(e=>e.size+"px"),(e=>e.size+"px")),N=o.default.div.withConfig({displayName:"pages__MobileHeaderWrapper",componentId:"sc-s6lv5q-3"})(["display:none;position:sticky;top:0;z-index:1;background-color:#ffffff;& h1{font-size:24px;margin:12px 0 8px;}@media (max-width:1024px){display:block;}"]),S=o.default.div.withConfig({displayName:"pages__Header",componentId:"sc-s6lv5q-4"})(["display:flex;justify-content:space-between;align-items:center;"]);var R=e=>{let{data:{site:{siteMetadata:{title:t,description:i,siteUrl:o,INIT_PER_PAGE_NUMBER:a,social:d}},allMarkdownRemark:{edges:c},allFile:{edges:p}}}=e;const{0:f,1:m}=(0,r.useState)(c),{0:h,1:u}=(0,r.useState)("CATEGORY"),{0:x,1:g}=(0,r.useState)("ALL"),v=(0,L.useMediaPredicate)("(max-width: 768px)");(0,r.useEffect)((()=>{m((()=>"CATEGORY"===h?c.filter((e=>{let{node:{frontmatter:t}}=e;return"ALL"===x||t.category===x})):c.filter((e=>{let{node:{frontmatter:t}}=e;return"ALL"===x||t.tags.includes(x)}))))}),[h,x,c]),(0,r.useEffect)((()=>{v&&u((e=>("CATEGORY"===e&&g("ALL"),"TAGS")))}),[v]);const w=(0,r.useCallback)(((e,t)=>{g(t),u(e),window.scrollTo(0,0)}),[]),C=(0,r.useMemo)((()=>p.find((e=>{var t;return"github"===(null===(t=e.node)||void 0===t?void 0:t.name)}))),[p]);return(0,s.jsx)(l.Z,{title:t,description:i,url:o,social:d,isVisibleHeader:!0,children:(0,s.jsxs)(F,{children:[(0,s.jsxs)(T,{children:[(0,s.jsxs)(N,{children:[(0,s.jsxs)(S,{children:[(0,s.jsx)(n.rU,{to:"/",children:(0,s.jsx)("h1",{children:"홍승아블로그"})}),(0,s.jsx)(E,{href:null==d?void 0:d.github,rel:"noopener noreferrer",title:"notion",target:"_blank",size:35,children:(0,s.jsx)("img",{src:null==C?void 0:C.node.publicURL,alt:"Github Link Image"})})]}),(0,s.jsx)(k,{posts:c,filter:x,handleFilter:w})]}),(0,s.jsx)(b,{posts:f,INIT_PER_PAGE_NUMBER:a})]}),!v&&(0,s.jsx)(z,{type:h,posts:c,filter:x,handleFilter:w})]})})}},450:function(e,t,i){var n=i(7294);function r(e){return"function"!=typeof matchMedia?null:matchMedia(e)}function o(e){return e?{media:e.media,matches:e.matches}:null}function l(e){var t=n.useState(!1),i=t[1];n.useEffect((function(){i(!0)}),[i]);var l=n.useState((function(){return o(r(e))})),a=l[1],s=n.useCallback((function(e){return a(o(e))}),[a]);return n.useEffect((function(){var t=r(e);return s(t),t&&t.addEventListener("change",s),function(){t&&t.removeEventListener("change",s)}}),[s,e]),t[0]?l[0]:null}e.exports={useMedia:l,useMediaPredicate:function(e){var t=l(e);return t&&t.matches||!1}}}}]);