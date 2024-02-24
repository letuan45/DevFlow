/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema } from "@/lib/validation";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";

interface Props {
  type?: string;
  mongoUserId: string;
  questionDetails?: string;
}

const Questions = ({ mongoUserId, type, questionDetails }: Props) => {
  const editorRef = useRef(null);
  const { mode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const parsedQuestionDetails = questionDetails
    ? JSON.parse(questionDetails)
    : {};
  const tagNames =
    parsedQuestionDetails && parsedQuestionDetails.tags
      ? parsedQuestionDetails.tags.map((item: any) => item.name)
      : [];

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestionDetails.title,
      explanation: parsedQuestionDetails.content,
      tags: tagNames,
    },
  });

  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true);

    try {
      if (type === "Edit") {
        await editQuestion({
          title: values.title,
          content: values.explanation,
          questionId: parsedQuestionDetails._id,
          path: pathname,
        });

        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any,
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value;
      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "tags must be less than 15 character",
          });
        }
      }

      if (!field.value.includes(tagValue as never)) {
        form.setValue("tags", [...field.value, tagValue]);
        tagInput.value = "";
        form.clearErrors("tags");
      }
    } else {
      form.trigger();
    }
  };

  const handleTagRemove = (
    tag: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any,
  ) => {
    const newTags = field.value.filter((t: string) => t !== tag);

    form.setValue("tags", newTags);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Question Title
                  <span className="ml-1 text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Ask a question to another persion.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Detail explanation of your problem
                  <span className="ml-1 text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-expect-error ignore-next-line
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => {
                      field.onChange(content);
                    }}
                    initialValue={parsedQuestionDetails.content || ""}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Introduce your problem and expand on what you put in the
                  title.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags
                  <span className="ml-1 text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <>
                    <Input
                      className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      placeholder="Add tags"
                      disabled={type === "Edit"}
                      onKeyDown={(e) => {
                        handleInputKeyDown(e, field);
                      }}
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag) => (
                          <Badge
                            key={tag}
                            className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                            onClick={() => {
                              handleTagRemove(tag, field);
                            }}
                          >
                            {tag}
                            {type !== "Edit" && (
                              <Image
                                src="/assets/icons/close.svg"
                                width={12}
                                height={12}
                                alt="Close icon"
                                className="cursor-pointer object-contain invert-0"
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Add 3 tags that most related to you problem.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <>{type === "Edit" ? "Editting..." : "Posting..."}</>
            )}
            {!isSubmitting && (
              <>{type === "Edit" ? "Edit Question" : "Ask a question"}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Questions;
