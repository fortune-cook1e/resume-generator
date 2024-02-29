import {
  SectionItem,
  SectionWithItem,
} from '@/web/types/entity/resume/sections';

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
} from '@chakra-ui/react';
import { useResumeStore } from '@/web/store/resume';
import { get } from 'lodash-es';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { useSectionContext } from '@/web/app/builder/components/Sidebars/left/sections/common/SectionContext';
import { useEffect } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { produce } from 'immer';

type Props<T extends SectionItem> = {
  form: UseFormReturn<T>;
  defaultValues: T;
  children: React.ReactNode;
};

// Modal 的逻辑如下：
// 1. 这是基本modal 用于 获取 form表单数据对相应模块的数据进行更新
// 2. 并且管理Modal 的展示和关闭
// 3. 这里的 Modal 用于渲染所有 模块的表单数据

const SectionModal = <T extends SectionItem>({ form, children }: Props<T>) => {
  const { id, mode, open, setOpen, payload } = useSectionContext();

  const section = useResumeStore((state) =>
    get(state.resume.data.sections, id),
  ) as SectionWithItem<T>;
  const setResume = useResumeStore((state) => state.setResume);

  const isCreate = mode === 'create';
  const isUpdate = mode === 'update';

  const onSubmit = async (values: T) => {
    console.log('ssss', values);
    // Todo: handle form values for create update

    if (isCreate) {
      setResume(
        `sections.${id}.items`,
        produce(section.items, (draft: T[]): void => {
          draft.push(values);
        }),
      );
    }

    if (isUpdate && payload) {
      setResume(
        `sections.${id}.items`,
        produce(section.items, (draft: T[]): void => {
          const index = draft.findIndex((item) => item.id === payload.id);
          if (index === -1) return;
          draft[index] = values;
        }),
      );
    }

    setOpen.off();
  };

  const onReset = () => {
    if (isCreate) {
      form.reset({
        ...form.getValues(),
        id: createId(),
      });
    }
    if (isUpdate) {
      form.reset({
        ...form.getValues(),
        ...payload,
      });
    }
  };

  useEffect(() => {
    open && onReset();
  }, [open, form]);

  return (
    <Modal isOpen={open} onClose={setOpen.off}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>
          {isCreate && `Create an item of ${section.name}`}
          {isUpdate && `Update an item of ${section.name}`}
        </ModalHeader>
        <ModalCloseButton></ModalCloseButton>
        <ModalBody>
          <form id="section-form" onSubmit={form.handleSubmit(onSubmit)}>
            {children}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={setOpen.off}>
            Close
          </Button>
          <Button colorScheme="blue" type="submit" form="section-form">
            {isCreate && 'Create an item'}
            {isUpdate && 'Update item'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SectionModal;
