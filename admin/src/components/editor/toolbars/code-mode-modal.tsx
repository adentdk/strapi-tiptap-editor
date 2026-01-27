import { useState, useEffect } from "react";
import {
  Modal,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
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
  let formatted = '';
  let indent = '';
  const tab = '  ';

  html.split(/>\s*</).forEach(function (element) {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }

    formatted += indent + '<' + element + '>\r\n';

    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("br") && !element.startsWith("hr")) {
      indent += tab;
    }
  });

  return formatted.substring(1, formatted.length - 3);
}

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

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={onClose} labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Code Editor
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Textarea
          name="json"
          onChange={(e: any) => setContent(e.target.value)}
          value={content}
          style={{ height: "400px", fontFamily: "monospace" }}
        />
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={onClose} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          <Button onClick={handleSave}>Finish</Button>
        }
      />
    </ModalLayout>
  );
};
