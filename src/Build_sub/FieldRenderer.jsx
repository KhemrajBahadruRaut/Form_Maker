import React from 'react';
import HeadingInput from '../field-types/HeadingInput';
import ParagraphField from '../field-types/ParagraphField';
import LongField from '../field-types/LongField';
import ShortField from '../field-types/ShortField';
import ImageField from '../field-types/ImageField';
import MCQField from '../field-types/MCQField';
import MultipleAnswersField from '../field-types/MultipleAnswersField';
import ImageChoiceField from '../field-types/ImageChoiceField';

const FieldRenderer = ({ field, onUpdateField, onRemoveOption }) => {
  const commonProps = { field, onUpdateField, onRemoveOption };

  switch (field.type) {
 
    case 'Heading':
      return <HeadingInput {...commonProps} />;
    case 'Paragraph':
      return <ParagraphField {...commonProps} />;
    case 'Long':
      return <LongField {...commonProps} />;
    case 'Short':
      return <ShortField {...commonProps} />;
    case 'Image':
      return <ImageField {...commonProps} />;
    case 'MCQ':
      return <MCQField {...commonProps} />;
    case 'MultipleAnswers':
      return <MultipleAnswersField {...commonProps} />;
    case 'ImageChoice':
      return <ImageChoiceField {...commonProps} />;
    default:
      return null;
  }
};

export default FieldRenderer;
