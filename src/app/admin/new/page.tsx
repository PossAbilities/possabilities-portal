import { NewPostForm } from "@/components/admin/NewPostForm";

export default function NewPostPage() {
  return (
    <>
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-stack-sm">
        New Post
      </h1>
      <p className="font-statement-text text-statement-text text-on-surface-variant max-w-2xl mb-stack-md">
        Share community news. It goes to the Request Inbox for an admin to review and publish.
      </p>
      <NewPostForm />
    </>
  );
}
