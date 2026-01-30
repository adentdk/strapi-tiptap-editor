import { useState, useEffect } from "react";
import {
  Modal,
  Button
} from "@strapi/design-system";
// @ts-ignore
import { Textarea } from "@strapi/design-system";

interface CodeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  initialContent: string;
}

const formatHTML = (html: string) => {
  const tab = '  ';
  let result = '';
  let indent = '';

  // Use a more robust regex-based approach for simple formatting
  html.split(/>\s*</).forEach((element) => {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }

    result += indent + '<' + element + '>\r\n';

    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("br") && !element.startsWith("hr")) {
      indent += tab;
    }
  });

  result = result.substring(1, result.length - 3);

  // Improve legibility of JSON attributes
  // Find data attributes that look like JSON (starting with &quot;[{ or &quot;{)
  // We'll replace them with single-quoted attributes and pretty-printed JSON
  result = result.replace(/(data-[\w-]+)="([^"]+)"/g, (match, attrName, attrValue) => {
    // Unescape common HTML entities
    let decodedValue = attrValue
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'");

    if ((decodedValue.startsWith('[') && decodedValue.endsWith(']')) ||
      (decodedValue.startsWith('{') && decodedValue.endsWith('}'))) {
      try {
        const jsonObj = JSON.parse(decodedValue);
        const prettyJson = JSON.stringify(jsonObj, null, 2);
        // Use single quotes for the attribute value so double quotes inside don't need escaping
        // But we need to escape single quotes inside the JSON
        const escapedPrettyJson = prettyJson.replace(/'/g, '&#39;');
        return `${attrName}='${escapedPrettyJson}'`;
      } catch (e) {
        // Not valid JSON or parsing failed, keep as is
        return match;
      }
    }
    return match;
  });

  return result;
};

export const CodeModeModal = ({ isOpen, onClose, onSave, initialContent }: CodeModeModalProps) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      try {
        // Simple formatter attempt
        setContent(formatHTML(initialContent));
      } catch (e) {
        setContent(initialContent);
      }
    }
  }, [isOpen, initialContent]);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <Modal.Content style={{ maxWidth: "95%" }}>
        <Modal.Header>
          <Modal.Title>Code Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Textarea
            name="json"
            onChange={(e: any) => setContent(e.target.value)}
            value={content}
            style={{ minHeight: "400px", height: "100%", fontFamily: "monospace" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">Cancel</Button>
          </Modal.Close>
          <Button onClick={handleSave}>Finish</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
