import Education from '@/templates/Ezreal/Education';
import Experience from '@/templates/Ezreal/Experience';
import Header from '@/templates/Ezreal/Header';
import Interests from '@/templates/Ezreal/Interests';
import Projects from '@/templates/Ezreal/Projects';
import { SectionKey, TemplateProps } from 'shared';
import { Fragment } from 'react';
import Skills from '@/templates/Ezreal/Skills';

const mapStrToComponent = (str: SectionKey) => {
  switch (str) {
    case 'education':
      return <Education />;
    case 'profiles':
      return null;
    case 'experience':
      return <Experience />;
    case 'projects':
      return <Projects />;
    case 'interests':
      return <Interests />;
    case 'skills':
      return <Skills />;
    default:
      return null;
  }
};

const Ezreal = ({ layout }: TemplateProps) => {
  const { main, side } = layout;

  return (
    <div className="p-custom space-y-4">
      <Header />
      {main.map((item) => (
        <Fragment key={item}>{mapStrToComponent(item)}</Fragment>
      ))}
      {side.map((item) => (
        <Fragment key={item}>{mapStrToComponent(item)}</Fragment>
      ))}
    </div>
  );
};

export default Ezreal;