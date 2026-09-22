import { EditEntryPage } from "@/features/entry/edit/edit-entry-page";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <EditEntryPage id={id} />;
}