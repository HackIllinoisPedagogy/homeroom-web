import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export const handleLatexRendering = (fragment) => {
	if (fragment.includes("$")) {
		return <InlineMath className="w-auto inline-block">{fragment.substring(1, fragment.length-1)}</InlineMath>;
	}
	return fragment;
}

export const generateRenderingArray = (str) => {
	let out = [];
	let latex = str.match(/[$].*?[$]/g);
	let text = str.split(/[$].*?[$]/g);

	if (latex == null) {
		return text;
	}

	if (str[0] === "$") {
		let temp = text;
		text = latex;
		latex = temp;
	}

	let count = 0;
	while (true) {
		if (count % 2 === 0) {
			if (count/2 > text.length - 1) {
				break;
			}
			out.push(text[count/2]);
		} else {
			if ((count-1)/2 > latex.length - 1) {
				break;
			}
			out.push(latex[(count-1)/2])
		}
		count++;
	}

	return out;
}
